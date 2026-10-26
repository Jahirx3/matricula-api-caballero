from fastapi import APIRouter, Depends, HTTPException, status

from app.database import conexion_lectura, hash_clave
from app.schemas import UsuarioLogin, UsuarioLoginRespuesta, UsuarioRespuesta
from app.security import crear_token_acceso, obtener_usuario_actual


router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=UsuarioLoginRespuesta)
def iniciar_sesion(datos: UsuarioLogin):
    """VALIDAR
    """
    with conexion_lectura() as conexion:
        fila = conexion.execute(
            "SELECT * FROM usuarios WHERE usuario = ?", (datos.usuario,)
        ).fetchone()

    if fila is None or fila["clave_hash"] != hash_clave(datos.clave):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    if not fila["activo"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Este usuario está inactivo",
        )

    # Creamos el token JWT con los datos relevantes del usuario
    token = crear_token_acceso({
        "sub": fila["usuario"],
        "id": fila["id"],
        "rol": fila["rol"],
        "nombre": fila["nombre_completo"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "id": fila["id"],
        "usuario": fila["usuario"],
        "nombre_completo": fila["nombre_completo"],
        "rol": fila["rol"],
    }


@router.get("/yo", response_model=UsuarioRespuesta)
def obtener_perfil_actual(usuario: dict = Depends(obtener_usuario_actual)):
    """Retorna la información del usuario actualmente autenticado mediante su token JWT.

    Permite al frontend validar si la sesión sigue activa al recargar la aplicación.
    """
    return usuario
