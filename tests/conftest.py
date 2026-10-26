import pytest
from fastapi.testclient import TestClient

import app.database as database
from app.main import app


@pytest.fixture()
def cliente(tmp_path, monkeypatch):
    monkeypatch.setattr(database, "DB_PATH", tmp_path / "pruebas.db")
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def headers_admin(cliente):
    """Obtiene las cabeceras con token JWT del usuario admin para pruebas."""
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"usuario": "admin", "clave": "admin123"},
    )
    token = respuesta.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def headers_docente(cliente):
    """Obtiene las cabeceras con token JWT del usuario docente para pruebas."""
    respuesta = cliente.post(
        "/api/v1/auth/login",
        json={"usuario": "docente", "clave": "docente123"},
    )
    token = respuesta.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
