import sqlite3

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import conexion_lectura, transaccion
from app.helpers import filas_a_lista, obtener_o_404
from app.schemas import DocenteEntrada, DocenteRespuesta, MensajeRespuesta
from app.security import obtener_usuario_actual, requerir_rol


router = APIRouter(prefix="/docentes", tags=["Docentes"])


@router.get(
    "",
    response_model=list[DocenteRespuesta],
    dependencies=[Depends(obtener_usuario_actual)],
)
def listar_docentes(
    buscar: str | None = Query(default=None, max_length=100),
    estado: str | None = Query(default=None, pattern="^(ACTIVO|INACTIVO)$"),
    especialidad: str | None = Query(default=None, max_length=120),
):
    condiciones: list[str] = []
    parametros: list[object] = []
    if buscar:
        condiciones.append(
            "(numero_empleado LIKE ? OR nombres LIKE ? OR apellidos LIKE ? "
            "OR especialidad LIKE ?)"
        )
        patron = f"%{buscar}%"
        parametros.extend([patron] * 4)
    if estado:
        condiciones.append("estado = ?")
        parametros.append(estado)
    if especialidad:
        condiciones.append("especialidad LIKE ?")
        parametros.append(f"%{especialidad}%")

    where = f"WHERE {' AND '.join(condiciones)}" if condiciones else ""
    with conexion_lectura() as conexion:
        filas = conexion.execute(
            f"""
            SELECT id, numero_empleado, nombres, apellidos, correo,
                   especialidad, estado
            FROM docentes {where}
            ORDER BY apellidos, nombres
            """,
            parametros,
        ).fetchall()
    return filas_a_lista(filas)


@router.get(
    "/{docente_id}",
    response_model=DocenteRespuesta,
    dependencies=[Depends(obtener_usuario_actual)],
)
def obtener_docente(docente_id: int):
    with conexion_lectura() as conexion:
        return dict(obtener_o_404(conexion, "docentes", docente_id, "Docente"))


@router.get(
    "/{docente_id}/secciones",
    dependencies=[Depends(obtener_usuario_actual)],
)
def listar_secciones_docente(docente_id: int):
    """Muestra los cursos y secciones asignados a un docente con horarios, aula y cupos."""
    with conexion_lectura() as conexion:
        obtener_o_404(conexion, "docentes", docente_id, "Docente")
        secciones = conexion.execute(
            """
            SELECT s.id AS seccion_id,
                   s.codigo AS seccion_codigo,
                   a.codigo AS asignatura_codigo,
                   a.nombre AS asignatura_nombre,
                   a.unidades_valorativas,
                   p.anio || '-' || p.numero AS periodo,
                   au.codigo AS aula_codigo,
                   s.dias,
                   s.hora_inicio || ' - ' || s.hora_fin AS horario,
                   s.cupo_maximo,
                   s.estado,
                   COUNT(CASE WHEN m.estado <> 'CANCELADA' THEN 1 END) AS matriculados,
                   s.cupo_maximo - COUNT(
                       CASE WHEN m.estado <> 'CANCELADA' THEN 1 END
                   ) AS cupos_disponibles
            FROM secciones s
            JOIN asignaturas a ON a.id = s.asignatura_id
            JOIN periodos p ON p.id = s.periodo_id
            LEFT JOIN aulas au ON au.id = s.aula_id
            LEFT JOIN matriculas m ON m.seccion_id = s.id
            WHERE s.docente_id = ?
            GROUP BY s.id, s.codigo, a.codigo, a.nombre, a.unidades_valorativas,
                     p.anio, p.numero, au.codigo, s.dias, s.hora_inicio,
                     s.hora_fin, s.cupo_maximo, s.estado
            ORDER BY p.anio DESC, p.numero DESC, s.hora_inicio
            """,
            (docente_id,),
        ).fetchall()
    return filas_a_lista(secciones)


@router.post(
    "",
    response_model=DocenteRespuesta,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(requerir_rol("ADMIN"))],
)
def crear_docente(datos: DocenteEntrada):
    try:
        with transaccion() as conexion:
            cursor = conexion.execute(
                """
                INSERT INTO docentes
                    (numero_empleado, nombres, apellidos, correo, especialidad, estado)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    datos.numero_empleado.upper(),
                    datos.nombres,
                    datos.apellidos,
                    str(datos.correo).lower(),
                    datos.especialidad,
                    datos.estado,
                ),
            )
            return dict(
                conexion.execute(
                    "SELECT * FROM docentes WHERE id = ?", (cursor.lastrowid,)
                ).fetchone()
            )
    except sqlite3.IntegrityError as error:
        raise HTTPException(409, "El número de empleado o correo ya existe") from error


@router.put(
    "/{docente_id}",
    response_model=DocenteRespuesta,
    dependencies=[Depends(requerir_rol("ADMIN"))],
)
def actualizar_docente(docente_id: int, datos: DocenteEntrada):
    try:
        with transaccion() as conexion:
            obtener_o_404(conexion, "docentes", docente_id, "Docente")
            conexion.execute(
                """
                UPDATE docentes
                SET numero_empleado = ?, nombres = ?, apellidos = ?, correo = ?,
                    especialidad = ?, estado = ?
                WHERE id = ?
                """,
                (
                    datos.numero_empleado.upper(),
                    datos.nombres,
                    datos.apellidos,
                    str(datos.correo).lower(),
                    datos.especialidad,
                    datos.estado,
                    docente_id,
                ),
            )
            return dict(
                conexion.execute(
                    "SELECT * FROM docentes WHERE id = ?", (docente_id,)
                ).fetchone()
            )
    except sqlite3.IntegrityError as error:
        raise HTTPException(
            409, "El número de empleado o correo pertenece a otro docente"
        ) from error


@router.delete(
    "/{docente_id}",
    response_model=MensajeRespuesta,
    dependencies=[Depends(requerir_rol("ADMIN"))],
)
def eliminar_docente(docente_id: int):
    try:
        with transaccion() as conexion:
            obtener_o_404(conexion, "docentes", docente_id, "Docente")
            conexion.execute("DELETE FROM docentes WHERE id = ?", (docente_id,))
        return {"mensaje": "Docente eliminado correctamente"}
    except sqlite3.IntegrityError as error:
        raise HTTPException(
            409, "No se puede eliminar: el docente tiene secciones asignadas"
        ) from error
