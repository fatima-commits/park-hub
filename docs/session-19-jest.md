# Lección 6.3 — Sesión 19: pruebas unitarias con Jest

**Objetivo:** diseñar y ejecutar pruebas unitarias para las reglas puras de reservación. Una prueba comprueba una regla con datos concretos y permite detectar cambios inesperados rápidamente.

## Estructura de una prueba

1. **Arrange:** preparar los datos de entrada y el resultado esperado.
2. **Act:** llamar a la función.
3. **Assert:** comparar el resultado real con el esperado.

`describe(...)` agrupa pruebas por función, `test(...)` nombra un caso y `expect(...)` realiza la comprobación. Aquí usamos `toBe(...)` para booleanos o `null`, y `toEqual(...)` para comparar el contenido de un período con fechas.

```ts
test('returns null when an input is not a string', () => {
  const startTime = null; // Arrange
  const endTime = '2026-10-13T11:00:00.000Z';
  const period = validateReservationPeriod(startTime, endTime); // Act
  expect(period).toBeNull(); // Assert
});
```

## Ejecutar

- `npm test`: ejecutar una vez todas las pruebas.
- `npm run test:watch`: repetirlas al guardar cambios.

Los escenarios de `src/features/reservations/__tests__/reservation.rules.test.ts` incluyen:

- `validateReservationPeriod`: períodos válidos (**happy path**), fechas iguales (**edge case**), orden inverso y entradas inválidas (**error cases**).
- `hasTimeConflict`: solapamientos (**happy path** para detectar conflictos), períodos adyacentes (**edge cases**) y períodos separados sin conflicto.
- `canReserveSpot`: espacio activo sin conflicto (**happy path**), espacio inactivo o con conflicto (**error cases**).

El servicio valida el período antes de llamar a `canReserveSpot(active, hasConflict)`. Esta función recibe solo dos booleanos, por lo que el caso de período inválido se prueba en `validateReservationPeriod`, no en `canReserveSpot`.

El servicio también consulta únicamente reservaciones con `status: 'ACTIVE'` antes de llamar a `hasTimeConflict`. Las canceladas quedan fuera de esa consulta; ninguna de las reglas puras recibe el estado de una reservación. Comprobar ese filtro requeriría una prueba del servicio con acceso a datos o mocks, fuera del alcance unitario de esta sesión.

## Student version

La configuración de Jest, los nombres de las pruebas y cinco ejemplos completos ya están preparados. En los bloques marcados, completar **Arrange, Act, Assert** sin cambiar las reglas de producción.

- **Live coding del profesor:** TODO S19 PROF 1 a 4 (período válido, conflicto exacto, límite entre períodos y espacio activo sin conflicto).
- **Actividad de estudiantes:** TODO S19 STUDENT 1 a 10 (períodos inválidos, solapamientos, límites y disponibilidad del espacio).

Jest puede mostrar un bloque TODO con cuerpo vacío como aprobado aunque todavía no contenga ninguna aserción. Durante la actividad, revisar también que cada bloque tenga un `expect(...)` significativo.

## Mostrar PASS y FAIL en clase

Una prueba que pasa puede mostrar:

```text
PASS  reservation.rules.test.ts
✓ accepts another valid period
```

Para mostrar un fallo, el profesor puede cambiar temporalmente `expect(allowed).toBe(false)` por `expect(allowed).toBe(true)` en el ejemplo completo del espacio inactivo con conflicto y ejecutar `npm test`:

```text
Expected: true
Received: false
```

Restaurar la expectativa correcta después de la demostración; la suite entregada debe pasar completa.

Una prueba verifica el comportamiento esperado en sus casos; no demuestra que toda la aplicación sea correcta.
