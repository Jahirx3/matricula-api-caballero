def test_inicio_y_dashboard(cliente, headers_admin):
    # La raíz "/" ahora sirve el frontend (login + dashboard) desde la
    # carpeta frontend/, en vez de devolver un JSON de bienvenida.
    respuesta = cliente.get("/")
    assert respuesta.status_code == 200
    assert "text/html" in respuesta.headers["content-type"]

    salud = cliente.get("/salud")
    assert salud.status_code == 200
    assert salud.json()["estado"] == "OK"

    dashboard = cliente.get("/api/v1/reportes/dashboard", headers=headers_admin)
    assert dashboard.status_code == 200
    assert dashboard.json()["estudiantes_activos"] == 4
    assert dashboard.json()["periodo_activo"] == "2026-3"


def test_login_correcto_e_incorrecto(cliente):
    correcto = cliente.post(
        "/api/v1/auth/login", json={"usuario": "admin", "clave": "admin123"}
    )
    assert correcto.status_code == 200
    assert correcto.json()["rol"] == "ADMIN"
    assert "access_token" in correcto.json()

    incorrecto = cliente.post(
        "/api/v1/auth/login", json={"usuario": "admin", "clave": "clave-mala"}
    )
    assert incorrecto.status_code == 401


def test_jwt_protege_endpoints(cliente):
    """Verifica que los endpoints protegidos rechacen peticiones sin token."""
    sin_token = cliente.get("/api/v1/estudiantes")
    assert sin_token.status_code == 401

    sin_token_dashboard = cliente.get("/api/v1/reportes/dashboard")
    assert sin_token_dashboard.status_code == 401


def test_jwt_rechaza_token_invalido(cliente):
    """Verifica que un token adulterado sea rechazado."""
    headers_falsos = {"Authorization": "Bearer token-inventado-12345"}
    respuesta = cliente.get("/api/v1/estudiantes", headers=headers_falsos)
    assert respuesta.status_code == 401


def test_rbac_docente_no_puede_crear_estudiante(cliente, headers_docente):
    """Verifica que un docente no puede crear estudiantes (solo ADMIN)."""
    nuevo = {
        "cuenta": "20269999",
        "nombres": "Test",
        "apellidos": "RBAC",
        "correo": "rbac@universidad.edu",
        "fecha_nacimiento": "2004-06-15",
        "carrera_id": 1,
        "estado": "ACTIVO",
    }
    respuesta = cliente.post("/api/v1/estudiantes", json=nuevo, headers=headers_docente)
    assert respuesta.status_code == 403
    assert "permiso" in respuesta.json()["detail"].lower()


def test_endpoint_yo_devuelve_perfil(cliente, headers_admin):
    """Verifica que GET /auth/yo devuelve el perfil del token activo."""
    respuesta = cliente.get("/api/v1/auth/yo", headers=headers_admin)
    assert respuesta.status_code == 200
    assert respuesta.json()["rol"] == "ADMIN"
    assert respuesta.json()["usuario"] == "admin"


def test_datos_iniciales_y_relaciones(cliente, headers_admin):
    respuesta = cliente.get("/api/v1/secciones", headers=headers_admin)
    assert respuesta.status_code == 200
    assert len(respuesta.json()) == 5
    assert respuesta.json()[0]["asignatura_codigo"]
    assert "cupos_disponibles" in respuesta.json()[0]


def test_crear_y_consultar_estudiante(cliente, headers_admin):
    nuevo = {
        "cuenta": "20262020",
        "nombres": "Pedro",
        "apellidos": "Castillo",
        "correo": "pedro@universidad.edu",
        "telefono": "9999-2020",
        "fecha_nacimiento": "2004-06-15",
        "carrera_id": 1,
        "estado": "ACTIVO",
    }
    creada = cliente.post("/api/v1/estudiantes", json=nuevo, headers=headers_admin)
    assert creada.status_code == 201
    estudiante_id = creada.json()["id"]
    assert creada.json()["carrera_codigo"] == "IS"

    consulta = cliente.get(f"/api/v1/estudiantes/{estudiante_id}", headers=headers_admin)
    assert consulta.status_code == 200
    assert consulta.json()["cuenta"] == "20262020"


def test_rechazar_cuenta_duplicada(cliente, headers_admin):
    duplicado = {
        "cuenta": "20261001",
        "nombres": "Otra",
        "apellidos": "Persona",
        "correo": "otra@universidad.edu",
        "fecha_nacimiento": "2003-01-01",
        "carrera_id": 1,
        "estado": "ACTIVO",
    }
    respuesta = cliente.post("/api/v1/estudiantes", json=duplicado, headers=headers_admin)
    assert respuesta.status_code == 409


def test_matricula_valida_y_duplicada(cliente, headers_admin):
    # Ana aprobó IS-110 y puede matricular Bases de Datos I, que lo exige.
    respuesta = cliente.post(
        "/api/v1/matriculas", json={"estudiante_id": 1, "seccion_id": 3},
        headers=headers_admin,
    )
    assert respuesta.status_code == 201
    assert respuesta.json()["asignatura_codigo"] == "IS-220"

    repetida = cliente.post(
        "/api/v1/matriculas", json={"estudiante_id": 1, "seccion_id": 3},
        headers=headers_admin,
    )
    assert repetida.status_code == 409


def test_rechazar_requisito_pendiente(cliente, headers_admin):
    # Sofía no tiene aprobada Programación I.
    respuesta = cliente.post(
        "/api/v1/matriculas", json={"estudiante_id": 3, "seccion_id": 2},
        headers=headers_admin,
    )
    assert respuesta.status_code == 409
    assert "requisito" in respuesta.json()["detail"].lower()


def test_rechazar_choque_de_horario(cliente, headers_admin):
    nueva_seccion = {
        "codigo": "0800",
        "asignatura_id": 1,
        "docente_id": 2,
        "periodo_id": 2,
        "aula_id": 3,
        "dias": "LU-MI",
        "hora_inicio": "08:00",
        "hora_fin": "10:00",
        "cupo_maximo": 30,
        "estado": "ABIERTA",
    }
    seccion = cliente.post("/api/v1/secciones", json=nueva_seccion, headers=headers_admin)
    assert seccion.status_code == 201

    respuesta = cliente.post(
        "/api/v1/matriculas",
        json={"estudiante_id": 1, "seccion_id": seccion.json()["id"]},
        headers=headers_admin,
    )
    assert respuesta.status_code == 409
    assert "choque" in respuesta.json()["detail"].lower()


def test_calcular_nota_y_actualizar_estado(cliente, headers_admin):
    respuesta = cliente.put(
        "/api/v1/calificaciones/matricula/3",
        json={
            "primer_parcial": 80,
            "segundo_parcial": 70,
            "tercer_parcial": 60,
            "observacion": "Promedio calculado por la API",
        },
        headers=headers_admin,
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["nota_final"] == 70
    assert respuesta.json()["resultado"] == "APROBADA"

    matricula = cliente.get("/api/v1/matriculas/3", headers=headers_admin)
    assert matricula.json()["estado"] == "APROBADA"


def test_cancelar_matricula_libera_cupo(cliente, headers_admin):
    antes = cliente.get("/api/v1/secciones/2", headers=headers_admin).json()["cupos_disponibles"]
    cancelada = cliente.patch("/api/v1/matriculas/3/cancelar", headers=headers_admin)
    assert cancelada.status_code == 200
    despues = cliente.get("/api/v1/secciones/2", headers=headers_admin).json()["cupos_disponibles"]
    assert despues == antes + 1


def test_reportes_de_historial_y_lista(cliente, headers_admin):
    historial = cliente.get("/api/v1/reportes/historial-estudiante/1", headers=headers_admin)
    assert historial.status_code == 200
    assert historial.json()["resumen"]["unidades_valorativas_aprobadas"] == 4

    lista = cliente.get("/api/v1/reportes/lista-seccion/2", headers=headers_admin)
    assert lista.status_code == 200
    assert lista.json()["cantidad_matriculados"] == 2


def test_validacion_pydantic_devuelve_422(cliente, headers_admin):
    invalido = {
        "cuenta": "12345",
        "nombres": "A",
        "apellidos": "B",
        "correo": "esto-no-es-correo",
        "fecha_nacimiento": "2030-01-01",
        "carrera_id": 1,
    }
    respuesta = cliente.post("/api/v1/estudiantes", json=invalido, headers=headers_admin)
    assert respuesta.status_code == 422


def test_matriculas_de_estudiante_reto_opcional(cliente, headers_admin):
    # Estudiante 1 (Ana) tiene matrículas en la BD inicial
    respuesta = cliente.get("/api/v1/estudiantes/1/matriculas", headers=headers_admin)
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    assert len(datos) > 0
    assert "asignatura_nombre" in datos[0]
    assert "seccion_codigo" in datos[0]

    # Estudiante inexistente devuelve 404
    respuesta_404 = cliente.get("/api/v1/estudiantes/9999/matriculas", headers=headers_admin)
    assert respuesta_404.status_code == 404


def test_secciones_de_docente(cliente, headers_admin):
    # Docente 1 tiene secciones asignadas en los datos iniciales
    respuesta = cliente.get("/api/v1/docentes/1/secciones", headers=headers_admin)
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    assert len(datos) > 0
    assert "asignatura_nombre" in datos[0]
    assert "seccion_codigo" in datos[0]
    assert "cupos_disponibles" in datos[0]

    # Docente inexistente devuelve 404
    respuesta_404 = cliente.get("/api/v1/docentes/9999/secciones", headers=headers_admin)
    assert respuesta_404.status_code == 404


def test_filtro_docentes_por_especialidad(cliente, headers_admin):
    respuesta = cliente.get(
        "/api/v1/docentes?especialidad=Software", headers=headers_admin
    )
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert isinstance(datos, list)
    assert all("Software" in d["especialidad"] for d in datos)
