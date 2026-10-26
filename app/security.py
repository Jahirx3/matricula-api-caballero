from datetime import datetime, timedelta, timezone
import os
from typing import Callable

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import conexion_lectura


# En entornos de producción, la clave secreta debe obtenerse de variables de entorno.
CLAVE_SECRETA = os.getenv("JWT_SECRET_KEY", "clave-super-secreta-sistema-academico-2026")
ALGORITMO = "HS256"
MINUTOS_EXPIRACION_TOKEN = 1   # 8 horas de duración para una jornada de trabajo

# Esquema Bearer para FastAPI: lee el encabezado 'Authorization: Bearer <token>'
# auto_error=False nos permite personalizar los mensajes de error 401
esquema_bearer = HTTPBearer(auto_error=False)


def crear_token_acceso(datos: dict, minutos_expiracion: int | None = None) -> str:
    """empaquetar
    """
    a_codificar = datos.copy()
    duracion = minutos_expiracion if minutos_expiracion is not None else MINUTOS_EXPIRACION_TOKEN
    expiracion = datetime.now(timezone.utc) + timedelta(minutes=duracion)

    a_codificar.update({
        "exp": expiracion,
        "iat": datetime.now(timezone.utc),
    })

    return jwt.encode(a_codificar, CLAVE_SECRETA, algorithm=ALGORITMO)


def decodificar_token(token: str) -> dict:
    """Verifica la firma y validez de un token JWT.

    Lanza HTTPException con código 401 si el token expiró o fue adulterado.
    """
    try:
        payload = jwt.decode(token, CLAVE_SECRETA, algorithms=[ALGORITMO])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="La sesión ha expirado. Por favor, vuelva a iniciar sesión.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorización inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def obtener_usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
) -> dict:
    """Proteger
    """
    if credenciales is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Se requiere autenticación. Inicie sesión para continuar.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credenciales.credentials
    payload = decodificar_token(token)

    usuario_nombre = payload.get("sub")
    if not usuario_nombre:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido: falta identificación del usuario.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    with conexion_lectura() as conexion:
        fila = conexion.execute(
            "SELECT id, usuario, nombre_completo, rol, activo FROM usuarios WHERE usuario = ?",
            (usuario_nombre,),
        ).fetchone()

    if fila is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El usuario del token ya no existe.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not fila["activo"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta de este usuario está desactivada.",
        )

    return {
        "id": fila["id"],
        "usuario": fila["usuario"],
        "nombre_completo": fila["nombre_completo"],
        "rol": fila["rol"],
    }


def requerir_rol(*roles_permitidos: str) -> Callable:
    """RBAC
    """
    def verificador_rol(usuario: dict = Depends(obtener_usuario_actual)) -> dict:
        if usuario["rol"] not in roles_permitidos:
            roles_str = ", ".join(roles_permitidos)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permiso denegado. Esta acción requiere rol de: {roles_str}",
            )
        return usuario

    return verificador_rol
