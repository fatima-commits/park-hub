# Lección 6.1 - Sesión 17 (80 minutos)

Integración de aplicaciones Backend con interfaces web.

**Objetivo:** recorrer el flujo navegador → Route → Service → Model → MongoDB y mostrar cómo `fetch()` usa respuestas HTTP para actualizar la interfaz. Esta rama es el punto de partida; algunas rutas y peticiones quedan incompletas para la clase.

## Live coding del profesor

1. Completar `GET /api/spots` en la Route usando el Service.
2. Solicitar los espacios con `fetch()` y renderizar la respuesta.
3. Completar `POST /api/reservations` usando el Service y responder con `201`.
4. Enviar los datos del formulario con `fetch()` POST y JSON.
5. Crear una reservación y repetir el horario para observar `201 Created` y `409 Conflict`.

## Actividad de estudiantes

1. Mostrar **Loading** mientras se esperan los espacios.
2. Mostrar **Empty** si la respuesta exitosa no contiene espacios.
3. Mostrar **Error** si falla la carga o la respuesta HTTP no es exitosa.
4. Mostrar un mensaje específico para **409 Conflict** y conservar el error genérico para otros fallos.

## Reto opcional

Actualizar espacios y reservaciones después de crear o cancelar una reservación, sin recargar la página.
