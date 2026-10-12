"""
Script para generar el diagrama UML requerido en la Tarea 2 (uml.png).
Clases: Usuario, Estudiante, Curso, Matricula con sus atributos y relaciones.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path


def generar_diagrama_uml():
    width = 1200
    height = 800
    image = Image.new("RGB", (width, height), color="#f8fafc")
    draw = ImageDraw.Draw(image)

    # Fuentes del sistema
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 26)
        font_header = ImageFont.truetype("arialbd.ttf", 18)
        font_body = ImageFont.truetype("arial.ttf", 14)
        font_small = ImageFont.truetype("ariali.ttf", 13)
        font_card = ImageFont.truetype("arialbd.ttf", 14)
    except Exception:
        font_title = ImageFont.load_default()
        font_header = font_title
        font_body = font_title
        font_small = font_title
        font_card = font_title

    # Título superior
    draw.text(
        (width // 2, 40),
        "DIAGRAMA DE CLASES UML - SISTEMA DE GESTIÓN ACADÉMICA / MATRÍCULA",
        fill="#0f172a",
        font=font_title,
        anchor="mm",
    )
    draw.text(
        (width // 2, 70),
        "Programación III · Tarea Semana 2 (IS-151)",
        fill="#64748b",
        font=font_small,
        anchor="mm",
    )

    def draw_class_box(x, y, w, h, title, attributes, header_bg="#2563eb"):
        # Sombra
        draw.rounded_rectangle(
            [x + 4, y + 4, x + w + 4, y + h + 4],
            radius=8,
            fill="#cbd5e1",
        )
        # Caja principal
        draw.rounded_rectangle(
            [x, y, x + w, y + h],
            radius=8,
            fill="#ffffff",
            outline="#334155",
            width=2,
        )
        # Cabecera
        draw.rounded_rectangle(
            [x, y, x + w, y + 42],
            radius=8,
            fill=header_bg,
        )
        draw.rectangle([x, y + 25, x + w, y + 42], fill=header_bg)
        draw.line([x, y + 42, x + w, y + 42], fill="#1e293b", width=2)
        draw.text(
            (x + w // 2, y + 21),
            title,
            fill="#ffffff",
            font=font_header,
            anchor="mm",
        )

        # Atributos
        curr_y = y + 55
        for attr in attributes:
            draw.text((x + 16, curr_y), attr, fill="#1e293b", font=font_body)
            curr_y += 22

    # 1. Estudiante (izquierda superior)
    estudiante_attrs = [
        "+ id: int [PK]",
        "+ cuenta: varchar(20)",
        "+ nombres: varchar(100)",
        "+ apellidos: varchar(100)",
        "+ correo: varchar(150)",
        "+ telefono: varchar(20)",
        "+ fecha_nacimiento: date",
        "+ carrera_id: int [FK]",
        "+ estado: varchar(20)",
        "+ creado_en: datetime",
    ]
    draw_class_box(70, 130, 290, 300, "Estudiante", estudiante_attrs, "#1d4ed8")

    # 2. Matricula (centro)
    matricula_attrs = [
        "+ id: int [PK]",
        "+ estudiante_id: int [FK]",
        "+ seccion_id: int [FK]",
        "+ fecha_matricula: datetime",
        "+ estado: varchar(20)",
    ]
    draw_class_box(460, 180, 280, 200, "Matrícula", matricula_attrs, "#0d9488")

    # 3. Curso / Asignatura (derecha)
    curso_attrs = [
        "+ id: int [PK]",
        "+ codigo: varchar(20)",
        "+ nombre: varchar(150)",
        "+ unidades_valorativas: int",
        "+ carrera_id: int [FK]",
        "+ requisito_id: int [FK]",
        "+ activo: boolean",
    ]
    draw_class_box(840, 150, 290, 240, "Curso (Asignatura)", curso_attrs, "#7c3aed")

    # 4. Usuario (abajo izquierda / centro)
    usuario_attrs = [
        "+ id: int [PK]",
        "+ usuario: varchar(50)",
        "+ nombre_completo: varchar(150)",
        "+ clave_hash: varchar(255)",
        "+ rol: varchar(20) [ADMIN, DOCENTE]",
        "+ activo: boolean",
        "+ creado_en: datetime",
    ]
    draw_class_box(240, 500, 330, 240, "Usuario (Autenticación)", usuario_attrs, "#d97706")

    # Línea de relación: Estudiante 1 ─── * Matrícula
    p1 = (360, 280)
    p2 = (460, 280)
    draw.line([p1, p2], fill="#0284c7", width=3)
    draw.text((375, 255), "1", fill="#0369a1", font=font_card)
    draw.text((435, 255), "*", fill="#0369a1", font=font_card)
    draw.text((385, 288), "realiza >", fill="#64748b", font=font_small)

    # Línea de relación: Curso 1 ─── * Matrícula
    p3 = (840, 280)
    p4 = (740, 280)
    draw.line([p3, p4], fill="#0284c7", width=3)
    draw.text((820, 255), "1", fill="#0369a1", font=font_card)
    draw.text((755, 255), "*", fill="#0369a1", font=font_card)
    draw.text((765, 288), "< contiene", fill="#64748b", font=font_small)

    # Nota de Usuario (Autenticación del sistema)
    draw.rounded_rectangle(
        [650, 530, 1080, 710],
        radius=8,
        fill="#f1f5f9",
        outline="#94a3b8",
        width=1,
    )
    draw.text((670, 550), "NOTAS DEL MODELO ACADÉMICO:", fill="#334155", font=font_header)
    draw.text(
        (670, 585),
        "• Un Estudiante puede tener múltiples Matrículas (1 a *).",
        fill="#475569",
        font=font_body,
    )
    draw.text(
        (670, 615),
        "• Un Curso (Asignatura/Sección) agrupa múltiples Matrículas (1 a *).",
        fill="#475569",
        font=font_body,
    )
    draw.text(
        (670, 645),
        "• Matrícula actúa como la relación N:M entre Estudiante y Curso.",
        fill="#475569",
        font=font_body,
    )
    draw.text(
        (670, 675),
        "• Usuario gestiona credenciales seguras (passwords con hash) y roles.",
        fill="#475569",
        font=font_body,
    )

    # Guardar en rutas del proyecto
    output_paths = [
        Path("uml.png"),
        Path("../uml.png"),
    ]
    for p in output_paths:
        try:
            image.save(p)
            print(f"Diagrama UML guardado en {p.resolve()}")
        except Exception as e:
            print(f"No se pudo guardar en {p}: {e}")


if __name__ == "__main__":
    generar_diagrama_uml()
