// Sistema Académico — frontend (vanilla JS, sin dependencias).
// Como este archivo se sirve desde la misma API (FastAPI + StaticFiles),
// las rutas son relativas: no hay problema de CORS.

const URL_BASE_API = "/api/v1";

const vistaLogin = document.getElementById("vista-login");
const vistaDashboard = document.getElementById("vista-dashboard");

const formularioLogin = document.getElementById("formulario-login");
const campoUsuario = document.getElementById("campo-usuario");
const campoClave = document.getElementById("campo-clave");
const botonEntrar = document.getElementById("boton-entrar");
const mensajeLogin = document.getElementById("mensaje-login");

const tituloBienvenida = document.getElementById("titulo-seccion-actual") || document.getElementById("titulo-bienvenida");
const subtituloSeccion = document.getElementById("subtitulo-seccion");
const chipUsuario = document.getElementById("chip-usuario");
const botonActualizar = document.getElementById("boton-actualizar");
const botonSalir = document.getElementById("boton-salir");
const filaTarjetas = document.getElementById("fila-tarjetas");
const textoPeriodo = document.getElementById("texto-periodo");
const campoBuscar = document.getElementById("campo-buscar");
const cuerpoTablaEstudiantes = document.getElementById("cuerpo-tabla-estudiantes");
const textoSinResultados = document.getElementById("texto-sin-resultados");

const tituloFormulario = document.getElementById("titulo-formulario");
const formularioEstudiante = document.getElementById("formulario-estudiante");
const campoEstudianteId = document.getElementById("estudiante-id");
const campoNombres = document.getElementById("estudiante-nombres");
const campoApellidos = document.getElementById("estudiante-apellidos");
const campoCuenta = document.getElementById("estudiante-cuenta");
const campoCorreo = document.getElementById("estudiante-correo");
const campoTelefono = document.getElementById("estudiante-telefono");
const campoNacimiento = document.getElementById("estudiante-nacimiento");
const campoCarrera = document.getElementById("estudiante-carrera");
const campoEstado = document.getElementById("estudiante-estado");
const botonGuardarEstudiante = document.getElementById("boton-guardar-estudiante");
const botonCancelarEdicion = document.getElementById("boton-cancelar-edicion");
const mensajeFormulario = document.getElementById("mensaje-formulario");

// Elementos del módulo de docentes
const tituloFormularioDocente = document.getElementById("titulo-formulario-docente");
const formularioDocente = document.getElementById("formulario-docente");
const campoDocenteId = document.getElementById("docente-id");
const campoDocenteNombres = document.getElementById("docente-nombres");
const campoDocenteApellidos = document.getElementById("docente-apellidos");
const campoDocenteEmpleado = document.getElementById("docente-empleado");
const campoDocenteCorreo = document.getElementById("docente-correo");
const campoDocenteEspecialidad = document.getElementById("docente-especialidad");
const campoDocenteEstado = document.getElementById("docente-estado");
const botonGuardarDocente = document.getElementById("boton-guardar-docente");
const botonCancelarDocente = document.getElementById("boton-cancelar-docente");
const mensajeFormularioDocente = document.getElementById("mensaje-formulario-docente");
const campoBuscarDocentes = document.getElementById("campo-buscar-docentes");
const cuerpoTablaDocentes = document.getElementById("cuerpo-tabla-docentes");
const textoSinResultadosDocentes = document.getElementById("texto-sin-resultados-docentes");

// Elementos del módulo de carreras
const tituloFormularioCarrera = document.getElementById("titulo-formulario-carrera");
const formularioCarrera = document.getElementById("formulario-carrera");
const campoCarreraFormId = document.getElementById("carrera-form-id");
const campoCarreraCodigo = document.getElementById("carrera-codigo");
const campoCarreraNombre = document.getElementById("carrera-nombre");
const campoCarreraDuracion = document.getElementById("carrera-duracion");
const campoCarreraActivo = document.getElementById("carrera-activo");
const botonGuardarCarrera = document.getElementById("boton-guardar-carrera");
const botonCancelarCarrera = document.getElementById("boton-cancelar-carrera");
const mensajeFormularioCarrera = document.getElementById("mensaje-formulario-carrera");
const campoBuscarCarreras = document.getElementById("campo-buscar-carreras");
const cuerpoTablaCarreras = document.getElementById("cuerpo-tabla-carreras");
const textoSinResultadosCarreras = document.getElementById("texto-sin-resultados-carreras");

// Elementos del menú responsive y layout
const botonMenuMovil = document.getElementById("boton-menu-movil");
const overlaySidebar = document.getElementById("overlay-sidebar");
const sidebar = document.querySelector(".sidebar");

// Filtros avanzados del módulo de estudiantes
const filtroEstudianteCarrera = document.getElementById("filtro-estudiante-carrera");
const filtroEstudianteEstado = document.getElementById("filtro-estudiante-estado");
const botonLimpiarFiltrosEstudiantes = document.getElementById("boton-limpiar-filtros-estudiantes");

// Filtros avanzados del módulo de docentes
const filtroDocenteEstado = document.getElementById("filtro-docente-estado");
const botonLimpiarFiltrosDocentes = document.getElementById("boton-limpiar-filtros-docentes");

// Filtros del módulo de carreras
const filtroCarreraEstado = document.getElementById("filtro-carrera-estado");
const botonLimpiarFiltrosCarreras = document.getElementById("boton-limpiar-filtros-carreras");

// Elementos del Modal de Matrículas de Estudiante
const modalMatriculasEstudiante = document.getElementById("modal-matriculas-estudiante");
const tituloModalEstudiante = document.getElementById("titulo-modal-estudiante");
const subtituloModalEstudiante = document.getElementById("subtitulo-modal-estudiante");
const totalAsignaturasEstudiante = document.getElementById("total-asignaturas-estudiante");
const totalUvEstudiante = document.getElementById("total-uv-estudiante");
const cuerpoTablaMatriculasEstudiante = document.getElementById("cuerpo-tabla-matriculas-estudiante");
const mensajeVacioMatriculas = document.getElementById("mensaje-vacio-matriculas");
const botonCerrarModalEstudiante = document.getElementById("boton-cerrar-modal-estudiante");
const botonCerrarModalEstudiantePie = document.getElementById("boton-cerrar-modal-estudiante-pie");

// Elementos del Modal de Clases de Docente
const modalClasesDocente = document.getElementById("modal-clases-docente");
const tituloModalDocente = document.getElementById("titulo-modal-docente");
const subtituloModalDocente = document.getElementById("subtitulo-modal-docente");
const totalClasesDocente = document.getElementById("total-clases-docente");
const totalAlumnosDocente = document.getElementById("total-alumnos-docente");
const cuerpoTablaClasesDocente = document.getElementById("cuerpo-tabla-clases-docente");
const mensajeVacioClasesDocente = document.getElementById("mensaje-vacio-clases-docente");
const botonCerrarModalDocente = document.getElementById("boton-cerrar-modal-docente");
const botonCerrarModalDocentePie = document.getElementById("boton-cerrar-modal-docente-pie");

let usuarioActual = null;
let temporizadorBusqueda = null;
let temporizadorBusquedaDocentes = null;
let temporizadorBusquedaCarreras = null;

function extraerMensajeError(detalle, fallback = "Ocurrió un error. Revise los datos.") {
  if (!detalle) return fallback;
  if (typeof detalle === "string") return detalle;
  if (typeof detalle.detail === "string") return detalle.detail;
  if (Array.isArray(detalle.detail)) {
    return detalle.detail
      .map((item) => {
        const campo = item.loc && item.loc.length > 0 ? item.loc[item.loc.length - 1] : "";
        return campo ? `${campo}: ${item.msg}` : item.msg;
      })
      .join(". ");
  }
  return fallback;
}

const TARJETAS_KPI = [
  { clave: "estudiantes_activos", etiqueta: "Estudiantes activos" },
  { clave: "docentes_activos", etiqueta: "Docentes activos" },
  { clave: "carreras_activas", etiqueta: "Carreras activas" },
  { clave: "asignaturas_activas", etiqueta: "Asignaturas activas" },
  { clave: "secciones_abiertas", etiqueta: "Secciones abiertas" },
  { clave: "matriculas_activas", etiqueta: "Matrículas activas" },
];

// ------------------------- Capa de Seguridad y JWT -------------------------

function obtenerToken() {
  return sessionStorage.getItem("token_academico");
}

function guardarSesion(usuario) {
  usuarioActual = usuario;
  if (usuario.access_token) {
    sessionStorage.setItem("token_academico", usuario.access_token);
    sessionStorage.setItem("usuario_academico", JSON.stringify(usuario));
  }
}

function limpiarSesion() {
  usuarioActual = null;
  sessionStorage.removeItem("token_academico");
  sessionStorage.removeItem("usuario_academico");
}

function cerrarSesionPorExpiracion() {
  limpiarSesion();
  formularioLogin.reset();
  vistaDashboard.classList.add("oculto");
  vistaLogin.classList.remove("oculto");
  if (mensajeLogin) {
    mensajeLogin.textContent = "Tu sesión ha expirado. Por favor ingresa nuevamente.";
    mensajeLogin.className = "mensaje-error";
  }
}

/**
 * Cliente HTTP para peticiones autenticadas.
 * Inyecta automáticamente el token JWT en el encabezado Authorization: Bearer <token>.
 * Si recibe 401 Unauthorized, redirige al login con aviso de expiración.
 */
async function apiFetch(url, opciones = {}) {
  const token = obtenerToken();
  const headers = { ...(opciones.headers || {}) };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const respuesta = await fetch(url, { ...opciones, headers });

  if (respuesta.status === 401 && !url.includes("/auth/login")) {
    cerrarSesionPorExpiracion();
    throw new Error("Sesión expirada o no autorizada");
  }

  return respuesta;
}

// ------------------------- Autenticación -------------------------

formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensajeLogin.textContent = "";
  botonEntrar.disabled = true;
  botonEntrar.textContent = "Entrando...";

  try {
    const respuesta = await fetch(`${URL_BASE_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: campoUsuario.value.trim(),
        clave: campoClave.value,
      }),
    });

    if (!respuesta.ok) {
      mensajeLogin.textContent =
        respuesta.status === 401
          ? "Usuario o contraseña incorrectos."
          : "No se pudo iniciar sesión.";
      return;
    }

    const datosUsuario = await respuesta.json();
    guardarSesion(datosUsuario);
    mostrarDashboard();
  } catch (error) {
    mensajeLogin.textContent =
      "No se pudo conectar con la API. ¿Está corriendo uvicorn?";
  } finally {
    botonEntrar.disabled = false;
    botonEntrar.textContent = "Iniciar sesión";
  }
});

botonSalir.addEventListener("click", () => {
  limpiarSesion();
  formularioLogin.reset();
  vistaDashboard.classList.add("oculto");
  vistaLogin.classList.remove("oculto");
});

// ------------------------- Dashboard -------------------------

function mostrarDashboard() {
  vistaLogin.classList.add("oculto");
  vistaDashboard.classList.remove("oculto");

  if (tituloBienvenida) {
    tituloBienvenida.textContent = "Panel general";
  }
  if (subtituloSeccion) {
    subtituloSeccion.textContent = `Bienvenido, ${usuarioActual.nombre_completo}`;
  }
  chipUsuario.textContent = `Rol: ${usuarioActual.rol} · (${usuarioActual.usuario})`;

  configurarNavegacionSidebar();
  construirTarjetasVacias();
  cargarDashboard();
  cargarCarreras();
  cargarEstudiantes();
  cargarDocentes();
}

function construirTarjetasVacias() {
  filaTarjetas.innerHTML = "";
  TARJETAS_KPI.forEach(({ clave, etiqueta }) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-kpi";
    tarjeta.innerHTML = `
      <div class="valor" data-kpi="${clave}">—</div>
      <div class="etiqueta-kpi">${etiqueta}</div>
    `;
    filaTarjetas.appendChild(tarjeta);
  });
}

async function cargarDashboard() {
  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/reportes/dashboard`);
    if (!respuesta.ok) throw new Error("dashboard no disponible");
    const resumen = await respuesta.json();

    TARJETAS_KPI.forEach(({ clave }) => {
      const nodo = filaTarjetas.querySelector(`[data-kpi="${clave}"]`);
      if (nodo) nodo.textContent = resumen[clave] ?? "—";
    });

    textoPeriodo.textContent = resumen.periodo_activo
      ? `Período académico activo: ${resumen.periodo_activo}`
      : "No hay un período académico activo.";
  } catch (error) {
    textoPeriodo.textContent = "No se pudieron cargar los indicadores.";
  }
}

// ------------------------- Carreras (para el <select>) -------------------------

async function cargarCarreras() {
  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/carreras?solo_activas=true`);
    if (!respuesta.ok) throw new Error("carreras no disponible");
    const carreras = await respuesta.json();

    campoCarrera.innerHTML = '<option value="">Seleccione una carrera</option>';
    if (filtroEstudianteCarrera) {
      filtroEstudianteCarrera.innerHTML = '<option value="">Todas las carreras</option>';
    }

    carreras.forEach((carrera) => {
      const opcion = document.createElement("option");
      opcion.value = carrera.id;
      opcion.textContent = `${carrera.codigo} — ${carrera.nombre}`;
      campoCarrera.appendChild(opcion);

      if (filtroEstudianteCarrera) {
        const opcionFiltro = document.createElement("option");
        opcionFiltro.value = carrera.id;
        opcionFiltro.textContent = `${carrera.codigo} — ${carrera.nombre}`;
        filtroEstudianteCarrera.appendChild(opcionFiltro);
      }
    });
  } catch (error) {
    campoCarrera.innerHTML = '<option value="">No se pudieron cargar las carreras</option>';
  }
}

// ------------------------- Crear / editar estudiante -------------------------

formularioEstudiante.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensajeFormulario.textContent = "";
  mensajeFormulario.className = "mensaje-error";

  const carreraId = Number(campoCarrera.value);
  if (!carreraId || carreraId <= 0) {
    mensajeFormulario.textContent = "Por favor, seleccione una carrera válida.";
    return;
  }

  if (!campoNacimiento.value) {
    mensajeFormulario.textContent = "Por favor, ingrese la fecha de nacimiento.";
    return;
  }

  const datos = {
    nombres: campoNombres.value.trim(),
    apellidos: campoApellidos.value.trim(),
    cuenta: campoCuenta.value.trim(),
    correo: campoCorreo.value.trim(),
    telefono: campoTelefono.value.trim() || null,
    fecha_nacimiento: campoNacimiento.value,
    carrera_id: carreraId,
    estado: campoEstado.value,
  };

  const idEnEdicion = campoEstudianteId.value;
  const esEdicion = Boolean(idEnEdicion);

  botonGuardarEstudiante.disabled = true;
  botonGuardarEstudiante.textContent = "Guardando...";

  try {
    const respuesta = await apiFetch(
      `${URL_BASE_API}/estudiantes${esEdicion ? `/${idEnEdicion}` : ""}`,
      {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      mensajeFormulario.textContent = extraerMensajeError(
        detalle,
        "No se pudo guardar el estudiante. Revise los datos."
      );
      return;
    }

    mensajeFormulario.textContent = esEdicion
      ? "Estudiante actualizado correctamente."
      : "Estudiante creado correctamente.";
    mensajeFormulario.className = "mensaje-exito";

    cancelarEdicion();
    cargarDashboard();
    cargarEstudiantes(campoBuscar.value.trim());
  } catch (error) {
    mensajeFormulario.textContent = "No se pudo conectar con la API.";
  } finally {
    botonGuardarEstudiante.disabled = false;
    botonGuardarEstudiante.textContent = campoEstudianteId.value
      ? "Guardar cambios"
      : "Guardar estudiante";
  }
});

function editarEstudiante(estudiante) {
  campoEstudianteId.value = estudiante.id;
  campoNombres.value = estudiante.nombres;
  campoApellidos.value = estudiante.apellidos;
  campoCuenta.value = estudiante.cuenta;
  campoCorreo.value = estudiante.correo;
  campoTelefono.value = estudiante.telefono ?? "";
  campoNacimiento.value = estudiante.fecha_nacimiento;
  campoCarrera.value = estudiante.carrera_id;
  campoEstado.value = estudiante.estado;

  tituloFormulario.textContent = `Editar estudiante — ${estudiante.nombres} ${estudiante.apellidos}`;
  botonGuardarEstudiante.textContent = "Guardar cambios";
  botonCancelarEdicion.classList.remove("oculto");
  mensajeFormulario.textContent = "";
  formularioEstudiante.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicion() {
  formularioEstudiante.reset();
  campoEstudianteId.value = "";
  tituloFormulario.textContent = "Nuevo estudiante";
  botonGuardarEstudiante.textContent = "Guardar estudiante";
  botonCancelarEdicion.classList.add("oculto");
}

botonCancelarEdicion.addEventListener("click", () => {
  cancelarEdicion();
  mensajeFormulario.textContent = "";
});

async function eliminarEstudiante(estudiante) {
  const confirmado = window.confirm(
    `¿Eliminar a ${estudiante.nombres} ${estudiante.apellidos}? Esta acción no se puede deshacer.`
  );
  if (!confirmado) return;

  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/estudiantes/${estudiante.id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      window.alert(
        extraerMensajeError(
          detalle,
          "No se pudo eliminar (puede tener historial de matrículas)."
        )
      );
      return;
    }
    cargarDashboard();
    cargarEstudiantes(campoBuscar.value.trim());
  } catch (error) {
    window.alert("No se pudo conectar con la API.");
  }
}

// ------------------------- Listado de estudiantes -------------------------

async function cargarEstudiantes() {
  try {
    const buscar = campoBuscar ? campoBuscar.value.trim() : "";
    const carreraId = filtroEstudianteCarrera ? filtroEstudianteCarrera.value : "";
    const estado = filtroEstudianteEstado ? filtroEstudianteEstado.value : "";

    const parametros = new URLSearchParams();
    if (buscar) parametros.append("buscar", buscar);
    if (carreraId) parametros.append("carrera_id", carreraId);
    if (estado) parametros.append("estado", estado);

    const query = parametros.toString() ? `?${parametros.toString()}` : "";
    const respuesta = await apiFetch(`${URL_BASE_API}/estudiantes${query}`);
    if (!respuesta.ok) throw new Error("estudiantes no disponible");
    const estudiantes = await respuesta.json();
    renderizarTablaEstudiantes(estudiantes);
  } catch (error) {
    cuerpoTablaEstudiantes.innerHTML = "";
    textoSinResultados.textContent = "No se pudo cargar la lista de estudiantes.";
    textoSinResultados.classList.remove("oculto");
  }
}

function renderizarTablaEstudiantes(estudiantes) {
  cuerpoTablaEstudiantes.innerHTML = "";

  if (estudiantes.length === 0) {
    textoSinResultados.textContent = "No se encontraron estudiantes con ese criterio.";
    textoSinResultados.classList.remove("oculto");
    return;
  }
  textoSinResultados.classList.add("oculto");

  estudiantes.forEach((estudiante) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><strong>${estudiante.cuenta}</strong></td>
      <td>${estudiante.nombres} ${estudiante.apellidos}</td>
      <td>${estudiante.correo}</td>
      <td>${estudiante.carrera_nombre}</td>
      <td>${pastillaEstado(estudiante.estado)}</td>
      <td class="acciones-fila">
        <button type="button" class="boton-icono info" data-accion="ver-matriculas" title="Ver clases donde está matriculado">🎓 Matrículas</button>
        <button type="button" class="boton-icono" data-accion="editar" title="Editar estudiante">Editar</button>
        <button type="button" class="boton-icono peligro" data-accion="eliminar" title="Eliminar estudiante">Eliminar</button>
      </td>
    `;
    fila.querySelector('[data-accion="ver-matriculas"]').addEventListener("click", () =>
      abrirModalMatriculasEstudiante(estudiante)
    );
    fila.querySelector('[data-accion="editar"]').addEventListener("click", () =>
      editarEstudiante(estudiante)
    );
    fila.querySelector('[data-accion="eliminar"]').addEventListener("click", () =>
      eliminarEstudiante(estudiante)
    );
    cuerpoTablaEstudiantes.appendChild(fila);
  });
}

function pastillaEstado(estado) {
  if (estado === "ACTIVO") {
    return `<span class="pastilla-estado pastilla-activo">Activo</span>`;
  }
  const etiquetas = { INACTIVO: "Inactivo", GRADUADO: "Graduado" };
  return `<span class="pastilla-estado pastilla-neutral">${etiquetas[estado] ?? estado}</span>`;
}

botonActualizar.addEventListener("click", () => {
  cargarDashboard();
  cargarEstudiantes();
  cargarDocentes();
  cargarCarrerasTabla();
});

campoBuscar.addEventListener("input", () => {
  clearTimeout(temporizadorBusqueda);
  temporizadorBusqueda = setTimeout(() => {
    cargarEstudiantes();
  }, 300);
});

filtroEstudianteCarrera?.addEventListener("change", () => {
  cargarEstudiantes();
});

filtroEstudianteEstado?.addEventListener("change", () => {
  cargarEstudiantes();
});

botonLimpiarFiltrosEstudiantes?.addEventListener("click", () => {
  if (campoBuscar) campoBuscar.value = "";
  if (filtroEstudianteCarrera) filtroEstudianteCarrera.value = "";
  if (filtroEstudianteEstado) filtroEstudianteEstado.value = "";
  cargarEstudiantes();
});

// ------------------------- Crear / editar docente -------------------------

formularioDocente?.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensajeFormularioDocente.textContent = "";
  mensajeFormularioDocente.className = "mensaje-error";

  const datos = {
    numero_empleado: campoDocenteEmpleado.value.trim().toUpperCase(),
    nombres: campoDocenteNombres.value.trim(),
    apellidos: campoDocenteApellidos.value.trim(),
    correo: campoDocenteCorreo.value.trim(),
    especialidad: campoDocenteEspecialidad.value.trim() || "General",
    estado: campoDocenteEstado.value,
  };

  const idEnEdicion = campoDocenteId.value;
  const esEdicion = Boolean(idEnEdicion);

  botonGuardarDocente.disabled = true;
  botonGuardarDocente.textContent = "Guardando...";

  try {
    const respuesta = await apiFetch(
      `${URL_BASE_API}/docentes${esEdicion ? `/${idEnEdicion}` : ""}`,
      {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      mensajeFormularioDocente.textContent = extraerMensajeError(
        detalle,
        "No se pudo guardar el docente. Revise los datos."
      );
      return;
    }

    mensajeFormularioDocente.textContent = esEdicion
      ? "Docente actualizado correctamente."
      : "Docente creado correctamente.";
    mensajeFormularioDocente.className = "mensaje-exito";

    cancelarEdicionDocente();
    cargarDashboard();
    cargarDocentes(campoBuscarDocentes ? campoBuscarDocentes.value.trim() : "");
  } catch (error) {
    mensajeFormularioDocente.textContent = "No se pudo conectar con la API.";
  } finally {
    botonGuardarDocente.disabled = false;
    botonGuardarDocente.textContent = campoDocenteId.value
      ? "Guardar cambios"
      : "Guardar docente";
  }
});

function editarDocente(docente) {
  campoDocenteId.value = docente.id;
  campoDocenteNombres.value = docente.nombres;
  campoDocenteApellidos.value = docente.apellidos;
  campoDocenteEmpleado.value = docente.numero_empleado;
  campoDocenteCorreo.value = docente.correo;
  campoDocenteEspecialidad.value = docente.especialidad;
  campoDocenteEstado.value = docente.estado;

  tituloFormularioDocente.textContent = `Editar docente — ${docente.nombres} ${docente.apellidos}`;
  botonGuardarDocente.textContent = "Guardar cambios";
  botonCancelarDocente?.classList.remove("oculto");
  mensajeFormularioDocente.textContent = "";
  formularioDocente.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicionDocente() {
  formularioDocente?.reset();
  if (campoDocenteId) campoDocenteId.value = "";
  if (tituloFormularioDocente) tituloFormularioDocente.textContent = "Nuevo docente";
  if (botonGuardarDocente) botonGuardarDocente.textContent = "Guardar docente";
  botonCancelarDocente?.classList.add("oculto");
}

botonCancelarDocente?.addEventListener("click", () => {
  cancelarEdicionDocente();
  if (mensajeFormularioDocente) mensajeFormularioDocente.textContent = "";
});

async function eliminarDocente(docente) {
  const confirmado = window.confirm(
    `¿Eliminar a ${docente.nombres} ${docente.apellidos}? Esta acción no se puede deshacer.`
  );
  if (!confirmado) return;

  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/docentes/${docente.id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      window.alert(
        extraerMensajeError(
          detalle,
          "No se pudo eliminar: el docente puede tener secciones asignadas."
        )
      );
      return;
    }
    cargarDashboard();
    cargarDocentes(campoBuscarDocentes ? campoBuscarDocentes.value.trim() : "");
  } catch (error) {
    window.alert("No se pudo conectar con la API.");
  }
}

// ------------------------- Listado de docentes -------------------------

async function cargarDocentes() {
  if (!cuerpoTablaDocentes) return;
  try {
    const buscar = campoBuscarDocentes ? campoBuscarDocentes.value.trim() : "";
    const estado = filtroDocenteEstado ? filtroDocenteEstado.value : "";

    const parametros = new URLSearchParams();
    if (buscar) parametros.append("buscar", buscar);
    if (estado) parametros.append("estado", estado);

    const query = parametros.toString() ? `?${parametros.toString()}` : "";
    const respuesta = await apiFetch(`${URL_BASE_API}/docentes${query}`);
    if (!respuesta.ok) throw new Error("docentes no disponible");
    const docentes = await respuesta.json();
    renderizarTablaDocentes(docentes);
  } catch (error) {
    cuerpoTablaDocentes.innerHTML = "";
    if (textoSinResultadosDocentes) {
      textoSinResultadosDocentes.textContent = "No se pudo cargar la lista de docentes.";
      textoSinResultadosDocentes.classList.remove("oculto");
    }
  }
}

function renderizarTablaDocentes(docentes) {
  if (!cuerpoTablaDocentes) return;
  cuerpoTablaDocentes.innerHTML = "";

  if (docentes.length === 0) {
    if (textoSinResultadosDocentes) {
      textoSinResultadosDocentes.textContent = "No se encontraron docentes con ese criterio.";
      textoSinResultadosDocentes.classList.remove("oculto");
    }
    return;
  }
  if (textoSinResultadosDocentes) {
    textoSinResultadosDocentes.classList.add("oculto");
  }

  docentes.forEach((docente) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td><strong>${docente.numero_empleado}</strong></td>
      <td>${docente.nombres} ${docente.apellidos}</td>
      <td>${docente.correo}</td>
      <td>${docente.especialidad}</td>
      <td>${pastillaEstado(docente.estado)}</td>
      <td class="acciones-fila">
        <button type="button" class="boton-icono info" data-accion="ver-clases" title="Ver clases asignadas a este docente">📚 Clases</button>
        <button type="button" class="boton-icono" data-accion="editar" title="Editar docente">Editar</button>
        <button type="button" class="boton-icono peligro" data-accion="eliminar" title="Eliminar docente">Eliminar</button>
      </td>
    `;
    fila.querySelector('[data-accion="ver-clases"]').addEventListener("click", () =>
      abrirModalClasesDocente(docente)
    );
    fila.querySelector('[data-accion="editar"]').addEventListener("click", () =>
      editarDocente(docente)
    );
    fila.querySelector('[data-accion="eliminar"]').addEventListener("click", () =>
      eliminarDocente(docente)
    );
    cuerpoTablaDocentes.appendChild(fila);
  });
}

campoBuscarDocentes?.addEventListener("input", () => {
  clearTimeout(temporizadorBusquedaDocentes);
  temporizadorBusquedaDocentes = setTimeout(() => {
    cargarDocentes();
  }, 300);
});

filtroDocenteEstado?.addEventListener("change", () => {
  cargarDocentes();
});

botonLimpiarFiltrosDocentes?.addEventListener("click", () => {
  if (campoBuscarDocentes) campoBuscarDocentes.value = "";
  if (filtroDocenteEstado) filtroDocenteEstado.value = "";
  cargarDocentes();
});

function configurarNavegacionSidebar() {
  const items = document.querySelectorAll(".sidebar-nav .nav-item");
  const tituloSeccion = document.getElementById("titulo-seccion-actual");

  items.forEach((item) => {
    item.onclick = (evento) => {
      evento.preventDefault();
      // 1. Quitar estado activo de todos los enlaces y activarlo en el seleccionado
      items.forEach((el) => el.classList.remove("activo"));
      item.classList.add("activo");

      // 2. Obtener la sección seleccionada
      const seccionId = item.dataset.seccion;
      const spanTexto = item.querySelector("span:last-child");
      const textoItem = spanTexto ? spanTexto.textContent.trim() : item.textContent.trim();

      // 3. Cambiar título en la barra superior
      if (tituloSeccion) {
        tituloSeccion.textContent = textoItem;
      }

      // 4. Cambiar la vista visible (SPA)
      cambiarSeccionActiva(seccionId, textoItem);

      // 5. En móviles o tablets, cerrar la barra lateral
      if (sidebar && sidebar.classList.contains("abierta")) {
        sidebar.classList.remove("abierta");
        overlaySidebar?.classList.add("oculto");
      }
    };
  });
}

/**
 * Muestra el módulo correspondiente y oculta los demás
 */
function cambiarSeccionActiva(seccionId, nombreModulo) {
  const seccionDashboard = document.getElementById("seccion-dashboard");
  const seccionEstudiantes = document.getElementById("seccion-estudiantes");
  const seccionGenerica = document.getElementById("seccion-generica");
  const mensajePendiente = document.getElementById("mensaje-modulo-pendiente");
  const subtituloPendiente = document.getElementById("subtitulo-modulo-pendiente");
  const badgeApiRuta = document.getElementById("badge-api-ruta");
  const seccionDocentes = document.getElementById("seccion-docentes");
  const seccionCarreras = document.getElementById("seccion-carreras");
  // Ocultamos todas primero
  seccionDashboard?.classList.add("oculto");
  seccionEstudiantes?.classList.add("oculto");
  seccionGenerica?.classList.add("oculto");
  seccionDocentes?.classList.add("oculto");
  seccionCarreras?.classList.add("oculto");

  // Mostramos según la selección
  if (seccionId === "dashboard") {
    seccionDashboard?.classList.remove("oculto");
    cargarDashboard();
  } else if (seccionId === "estudiantes") {
    seccionEstudiantes?.classList.remove("oculto");
    cargarEstudiantes(campoBuscar.value.trim());
  } else if (seccionId === "docentes") {
    seccionDocentes?.classList.remove("oculto");
    cargarDocentes(campoBuscarDocentes ? campoBuscarDocentes.value.trim() : "");
  } else if (seccionId === "carreras") {
    seccionCarreras?.classList.remove("oculto");
    cargarCarrerasTabla(campoBuscarCarreras ? campoBuscarCarreras.value.trim() : "");
  } else {
    // Para los routers que aún estamos implementando
    if (mensajePendiente) {
      mensajePendiente.textContent = `Módulo de ${nombreModulo}`;
    }
    if (subtituloPendiente) {
      subtituloPendiente.textContent = `Gestiona la información académica mediante el router ${seccionId}.py.`;
    }
    if (badgeApiRuta) {
      badgeApiRuta.textContent = `API Endpoint: /api/v1/${seccionId}`;
    }
    seccionGenerica?.classList.remove("oculto");
  }
}

// ------------------------- Crear / editar carrera -------------------------

formularioCarrera?.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensajeFormularioCarrera.textContent = "";
  mensajeFormularioCarrera.className = "mensaje-error";

  const datos = {
    codigo: campoCarreraCodigo.value.trim().toUpperCase(),
    nombre: campoCarreraNombre.value.trim(),
    duracion_anios: Number(campoCarreraDuracion.value),
    activo: campoCarreraActivo.value === "true",
  };

  const idEnEdicion = campoCarreraFormId.value;
  const esEdicion = Boolean(idEnEdicion);

  botonGuardarCarrera.disabled = true;
  botonGuardarCarrera.textContent = "Guardando...";

  try {
    const respuesta = await apiFetch(
      `${URL_BASE_API}/carreras${esEdicion ? `/${idEnEdicion}` : ""}`,
      {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      mensajeFormularioCarrera.textContent = extraerMensajeError(
        detalle,
        "No se pudo guardar la carrera. Revise los datos."
      );
      return;
    }

    mensajeFormularioCarrera.textContent = esEdicion
      ? "Carrera actualizada correctamente."
      : "Carrera creada correctamente.";
    mensajeFormularioCarrera.className = "mensaje-exito";

    cancelarEdicionCarrera();
    cargarDashboard();
    cargarCarreras(); // Actualiza el <select> de estudiantes
    cargarCarrerasTabla(campoBuscarCarreras ? campoBuscarCarreras.value.trim() : "");
  } catch (error) {
    mensajeFormularioCarrera.textContent = "No se pudo conectar con la API.";
  } finally {
    botonGuardarCarrera.disabled = false;
    botonGuardarCarrera.textContent = campoCarreraFormId.value
      ? "Guardar cambios"
      : "Guardar carrera";
  }
});

function editarCarrera(carrera) {
  campoCarreraFormId.value = carrera.id;
  campoCarreraCodigo.value = carrera.codigo;
  campoCarreraNombre.value = carrera.nombre;
  campoCarreraDuracion.value = carrera.duracion_anios;
  campoCarreraActivo.value = carrera.activo ? "true" : "false";

  tituloFormularioCarrera.textContent = `Editar carrera — ${carrera.nombre}`;
  botonGuardarCarrera.textContent = "Guardar cambios";
  botonCancelarCarrera?.classList.remove("oculto");
  mensajeFormularioCarrera.textContent = "";
  formularioCarrera.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicionCarrera() {
  formularioCarrera?.reset();
  if (campoCarreraFormId) campoCarreraFormId.value = "";
  if (campoCarreraDuracion) campoCarreraDuracion.value = "4";
  if (tituloFormularioCarrera) tituloFormularioCarrera.textContent = "Nueva carrera";
  if (botonGuardarCarrera) botonGuardarCarrera.textContent = "Guardar carrera";
  botonCancelarCarrera?.classList.add("oculto");
}

botonCancelarCarrera?.addEventListener("click", () => {
  cancelarEdicionCarrera();
  if (mensajeFormularioCarrera) mensajeFormularioCarrera.textContent = "";
});

async function eliminarCarrera(carrera) {
  const confirmado = window.confirm(
    `¿Eliminar la carrera "${carrera.nombre}"? Esta acción no se puede deshacer.`
  );
  if (!confirmado) return;

  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/carreras/${carrera.id}`, {
      method: "DELETE",
    });
    if (!respuesta.ok) {
      const detalle = await respuesta.json().catch(() => null);
      window.alert(
        extraerMensajeError(
          detalle,
          "No se pudo eliminar: la carrera tiene estudiantes o asignaturas."
        )
      );
      return;
    }
    cargarDashboard();
    cargarCarreras(); // Actualiza el <select>
    cargarCarrerasTabla(campoBuscarCarreras ? campoBuscarCarreras.value.trim() : "");
  } catch (error) {
    window.alert("No se pudo conectar con la API.");
  }
}

// ------------------------- Listado de carreras (tabla) -------------------------

async function cargarCarrerasTabla() {
  if (!cuerpoTablaCarreras) return;
  try {
    const buscar = campoBuscarCarreras ? campoBuscarCarreras.value.trim() : "";
    const estado = filtroCarreraEstado ? filtroCarreraEstado.value : "";

    const parametros = new URLSearchParams();
    if (buscar) parametros.append("buscar", buscar);
    if (estado === "true") parametros.append("solo_activas", "true");

    const query = parametros.toString() ? `?${parametros.toString()}` : "";
    const respuesta = await apiFetch(`${URL_BASE_API}/carreras${query}`);
    if (!respuesta.ok) throw new Error("carreras no disponible");
    let carreras = await respuesta.json();
    if (estado === "false") {
      carreras = carreras.filter((c) => !c.activo);
    }
    renderizarTablaCarreras(carreras);
  } catch (error) {
    cuerpoTablaCarreras.innerHTML = "";
    if (textoSinResultadosCarreras) {
      textoSinResultadosCarreras.textContent = "No se pudo cargar la lista de carreras.";
      textoSinResultadosCarreras.classList.remove("oculto");
    }
  }
}

function renderizarTablaCarreras(carreras) {
  if (!cuerpoTablaCarreras) return;
  cuerpoTablaCarreras.innerHTML = "";

  if (carreras.length === 0) {
    if (textoSinResultadosCarreras) {
      textoSinResultadosCarreras.textContent = "No se encontraron carreras con ese criterio.";
      textoSinResultadosCarreras.classList.remove("oculto");
    }
    return;
  }
  if (textoSinResultadosCarreras) {
    textoSinResultadosCarreras.classList.add("oculto");
  }

  carreras.forEach((carrera) => {
    const fila = document.createElement("tr");
    const estadoTexto = carrera.activo ? "Activa" : "Inactiva";
    const pastilla = carrera.activo
      ? `<span class="pastilla-estado pastilla-activo">${estadoTexto}</span>`
      : `<span class="pastilla-estado pastilla-neutral">${estadoTexto}</span>`;
    fila.innerHTML = `
      <td><strong>${carrera.codigo}</strong></td>
      <td>${carrera.nombre}</td>
      <td>${carrera.duracion_anios} año${carrera.duracion_anios > 1 ? "s" : ""}</td>
      <td>${pastilla}</td>
      <td class="acciones-fila">
        <button type="button" class="boton-icono" data-accion="editar" title="Editar carrera">Editar</button>
        <button type="button" class="boton-icono peligro" data-accion="eliminar" title="Eliminar carrera">Eliminar</button>
      </td>
    `;
    fila.querySelector('[data-accion="editar"]').addEventListener("click", () =>
      editarCarrera(carrera)
    );
    fila.querySelector('[data-accion="eliminar"]').addEventListener("click", () =>
      eliminarCarrera(carrera)
    );
    cuerpoTablaCarreras.appendChild(fila);
  });
}

campoBuscarCarreras?.addEventListener("input", () => {
  clearTimeout(temporizadorBusquedaCarreras);
  temporizadorBusquedaCarreras = setTimeout(() => {
    cargarCarrerasTabla();
  }, 300);
});

filtroCarreraEstado?.addEventListener("change", () => {
  cargarCarrerasTabla();
});

botonLimpiarFiltrosCarreras?.addEventListener("click", () => {
  if (campoBuscarCarreras) campoBuscarCarreras.value = "";
  if (filtroCarreraEstado) filtroCarreraEstado.value = "";
  cargarCarrerasTabla();
});

// ------------------------- Funciones de Modales y Menú Móvil -------------------------

// Control de apertura y cierre del menú móvil lateral
botonMenuMovil?.addEventListener("click", () => {
  if (!sidebar) return;
  sidebar.classList.toggle("abierta");
  overlaySidebar?.classList.toggle("oculto");
});

overlaySidebar?.addEventListener("click", () => {
  sidebar?.classList.remove("abierta");
  overlaySidebar.classList.add("oculto");
});

// Modal de Matrículas del Estudiante
async function abrirModalMatriculasEstudiante(estudiante) {
  if (!modalMatriculasEstudiante) return;
  tituloModalEstudiante.textContent = `${estudiante.nombres} ${estudiante.apellidos}`;
  subtituloModalEstudiante.textContent = `Cuenta: ${estudiante.cuenta} · Carrera: ${estudiante.carrera_nombre} · Estado: ${estudiante.estado}`;

  cuerpoTablaMatriculasEstudiante.innerHTML = `
    <tr><td colspan="7" style="text-align: center; padding: 22px; color: var(--tinta-secundaria);">
      Cargando asignaturas matriculadas...
    </td></tr>
  `;
  mensajeVacioMatriculas.classList.add("oculto");
  totalAsignaturasEstudiante.textContent = "—";
  totalUvEstudiante.textContent = "—";
  modalMatriculasEstudiante.classList.remove("oculto");

  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/estudiantes/${estudiante.id}/matriculas`);
    if (!respuesta.ok) throw new Error("No se pudieron cargar las matrículas");
    const matriculas = await respuesta.json();
    renderizarMatriculasEstudianteModal(matriculas);
  } catch (err) {
    cuerpoTablaMatriculasEstudiante.innerHTML = `
      <tr><td colspan="7" style="text-align: center; color: var(--estado-critico); padding: 18px;">
        No se pudo consultar el historial de matrículas del estudiante.
      </td></tr>
    `;
  }
}

function renderizarMatriculasEstudianteModal(matriculas) {
  cuerpoTablaMatriculasEstudiante.innerHTML = "";
  if (!matriculas || matriculas.length === 0) {
    mensajeVacioMatriculas.classList.remove("oculto");
    totalAsignaturasEstudiante.textContent = "0";
    totalUvEstudiante.textContent = "0";
    return;
  }

  mensajeVacioMatriculas.classList.add("oculto");
  totalAsignaturasEstudiante.textContent = matriculas.length;
  const totalUVs = matriculas.reduce((suma, m) => suma + (m.unidades_valorativas || 0), 0);
  totalUvEstudiante.textContent = totalUVs;

  matriculas.forEach((m) => {
    const fila = document.createElement("tr");
    const nota = m.nota_final !== null && m.nota_final !== undefined ? `${m.nota_final}%` : "—";
    fila.innerHTML = `
      <td>
        <strong>${m.asignatura_codigo}</strong> — ${m.asignatura_nombre}
        <small style="display:block; color:var(--tinta-tenue)">${m.unidades_valorativas} UV</small>
      </td>
      <td><strong>${m.seccion_codigo}</strong></td>
      <td>${m.periodo}</td>
      <td>${m.docente || "No asignado"}</td>
      <td>${m.dias} · ${m.horario}</td>
      <td><strong>${nota}</strong></td>
      <td>${pastillaEstadoMatricula(m.estado)}</td>
    `;
    cuerpoTablaMatriculasEstudiante.appendChild(fila);
  });
}

function pastillaEstadoMatricula(estado) {
  if (estado === "APROBADA") {
    return `<span class="pastilla-estado pastilla-activo">Aprobada</span>`;
  }
  if (estado === "REPROBADA" || estado === "CANCELADA") {
    return `<span class="pastilla-estado" style="color:var(--estado-critico); background:var(--estado-critico-fondo);">${estado}</span>`;
  }
  return `<span class="pastilla-estado pastilla-activo" style="color:var(--acento); background:var(--acento-suave);">Matriculada</span>`;
}

function cerrarModalMatriculasEstudiante() {
  modalMatriculasEstudiante?.classList.add("oculto");
}

botonCerrarModalEstudiante?.addEventListener("click", cerrarModalMatriculasEstudiante);
botonCerrarModalEstudiantePie?.addEventListener("click", cerrarModalMatriculasEstudiante);

// Modal de Clases Asignadas al Docente
async function abrirModalClasesDocente(docente) {
  if (!modalClasesDocente) return;
  tituloModalDocente.textContent = `${docente.nombres} ${docente.apellidos}`;
  subtituloModalDocente.textContent = `Nº Empleado: ${docente.numero_empleado} · Especialidad: ${docente.especialidad} · Estado: ${docente.estado}`;

  cuerpoTablaClasesDocente.innerHTML = `
    <tr><td colspan="7" style="text-align: center; padding: 22px; color: var(--tinta-secundaria);">
      Cargando clases asignadas...
    </td></tr>
  `;
  mensajeVacioClasesDocente.classList.add("oculto");
  totalClasesDocente.textContent = "—";
  totalAlumnosDocente.textContent = "—";
  modalClasesDocente.classList.remove("oculto");

  try {
    const respuesta = await apiFetch(`${URL_BASE_API}/docentes/${docente.id}/secciones`);
    if (!respuesta.ok) throw new Error("No se pudieron cargar las clases");
    const secciones = await respuesta.json();
    renderizarClasesDocenteModal(secciones);
  } catch (err) {
    cuerpoTablaClasesDocente.innerHTML = `
      <tr><td colspan="7" style="text-align: center; color: var(--estado-critico); padding: 18px;">
        No se pudieron consultar las clases asignadas al docente.
      </td></tr>
    `;
  }
}

function renderizarClasesDocenteModal(secciones) {
  cuerpoTablaClasesDocente.innerHTML = "";
  if (!secciones || secciones.length === 0) {
    mensajeVacioClasesDocente.classList.remove("oculto");
    totalClasesDocente.textContent = "0";
    totalAlumnosDocente.textContent = "0";
    return;
  }

  mensajeVacioClasesDocente.classList.add("oculto");
  totalClasesDocente.textContent = secciones.length;
  const totalAlumnos = secciones.reduce((suma, s) => suma + (s.matriculados || 0), 0);
  totalAlumnosDocente.textContent = totalAlumnos;

  secciones.forEach((s) => {
    const fila = document.createElement("tr");
    const cupoInfo = `<strong>${s.matriculados}</strong> / ${s.cupo_maximo} <small style="display:block; color:var(--tinta-tenue)">(${s.cupos_disponibles} disp.)</small>`;
    fila.innerHTML = `
      <td>
        <strong>${s.asignatura_codigo}</strong> — ${s.asignatura_nombre}
        <small style="display:block; color:var(--tinta-tenue)">${s.unidades_valorativas} UV</small>
      </td>
      <td><strong>${s.seccion_codigo}</strong></td>
      <td>${s.periodo}</td>
      <td>${s.dias} · ${s.horario}</td>
      <td>${s.aula_codigo || "Virtual / Sin aula"}</td>
      <td>${cupoInfo}</td>
      <td>${pastillaEstadoSeccion(s.estado)}</td>
    `;
    cuerpoTablaClasesDocente.appendChild(fila);
  });
}

function pastillaEstadoSeccion(estado) {
  if (estado === "ABIERTA") {
    return `<span class="pastilla-estado pastilla-activo">Abierta</span>`;
  }
  if (estado === "CERRADA") {
    return `<span class="pastilla-estado pastilla-neutral">Cerrada</span>`;
  }
  return `<span class="pastilla-estado pastilla-neutral">${estado}</span>`;
}

function cerrarModalClasesDocente() {
  modalClasesDocente?.classList.add("oculto");
}

botonCerrarModalDocente?.addEventListener("click", cerrarModalClasesDocente);
botonCerrarModalDocentePie?.addEventListener("click", cerrarModalClasesDocente);

// Cierre de modales al presionar la tecla Escape o pulsar en el backdrop oscuro
window.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    cerrarModalMatriculasEstudiante();
    cerrarModalClasesDocente();
  }
});

[modalMatriculasEstudiante, modalClasesDocente].forEach((modal) => {
  modal?.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      modal.classList.add("oculto");
    }
  });
});

// ------------------------- Inicio: Validar Sesión Existente -------------------------

async function verificarSesionExistente() {
  const token = obtenerToken();
  if (!token) return;

  try {
    const respuesta = await fetch(`${URL_BASE_API}/auth/yo`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (respuesta.ok) {
      const perfil = await respuesta.json();
      usuarioActual = { ...perfil, access_token: token };
      mostrarDashboard();
    } else {
      limpiarSesion();
    }
  } catch (error) {
    // Si la API aún no responde, se mantiene en la vista de login
  }
}

// Ejecutar verificación al cargar la página
verificarSesionExistente();