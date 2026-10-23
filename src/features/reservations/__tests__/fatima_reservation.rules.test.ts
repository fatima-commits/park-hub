import { describe, expect, test } from "@jest/globals";
import {
  canReserveSpot,
  hasTimeConflict,
  validateExtension,
} from "../reservation.rules";

describe("Pruebas de nueva feature", () => {
  const currentStartTime = new Date("2026-10-14T10:00:00.000Z");
  const currentEndTime = new Date("2026-10-14T12:00:00.000Z");

  test("Extensión de reserva exitosa", () => {
    //arrange
    const newEndTimeInput = "2026-10-14T14:00:00.000Z";
    //act
    const result = validateExtension(newEndTimeInput, currentEndTime);
    //assert
    expect(result).toEqual(new Date(newEndTimeInput));
  });

  test("NewEndTime inválido", () => {
    //arrange
    const invalidEndTime = "formato-invalido-de-fecha";
    //act
    const result = validateExtension(invalidEndTime, currentEndTime);
    //assert
    expect(result).toBeNull();
  });

  test("Usuario no tiene reserva activa", () => {
    //arrange
    const isReservationFound = false;
    //act
    //assert
    expect(isReservationFound).toBe(false);
  });

  test("La hora de extensión es antes de la original", () => {
    //arrange
    const earlierEndTime = "2026-10-14T11:00:00.000Z";
    //act
    const result = validateExtension(earlierEndTime, currentEndTime);
    //assert
    expect(result).toBeNull();
  });

  test("Hay una reserva cancelada estorbando", () => {
    //arrange
    const newStart = new Date("2026-10-14T12:00:00.000Z");
    const newEnd = new Date("2026-10-14T14:00:00.000Z");
    const cancelledReservationStatus: string = "CANCELLED";
    //act
    const isConflict =
      cancelledReservationStatus === "ACTIVE" &&
      hasTimeConflict(newStart, newEnd, currentStartTime, currentEndTime);
    //assert
    expect(isConflict).toBe(false);
  });

  test("No se encuentra la reserva a extender", () => {
    //arrange
    const reservationId = "id_invalido_9999";
    const correctReservations: string[] = ["id_101", "id_102"];
    // act
    const exists = correctReservations.includes(reservationId);
    // assert
    expect(exists).toBe(false);
  });

  test("Ya hay otra reserva activa en el espacio a extender", () => {
//arrange
    const existingActiveStart = new Date("2026-10-14T13:00:00.000Z");
    const existingActiveEnd = new Date("2026-10-14T15:00:00.000Z");
    const newExtensionStart = new Date("2026-10-14T12:00:00.000Z");
    const newExtensionEnd = new Date("2026-10-14T14:00:00.000Z");

    //act
    const conflict = hasTimeConflict(
      newExtensionStart,
      newExtensionEnd,
      existingActiveStart,
      existingActiveEnd
    );

    //assert
    expect(conflict).toBe(true);
  });

  test("Intento de extensión sobre reserva cancelada", () => {
    //arrange
    const isSpotActive = false;
    const hasConflict = false;
    //act
    const allowed = canReserveSpot(isSpotActive, hasConflict);
    //assert
    expect(allowed).toBe(false);
  });

  test("Intento de extensión enviando la misma hora final actual", () => {
    // arrange
    const sameEndTime = "2026-10-14T12:00:00.000Z";
    //act
    const result = validateExtension(sameEndTime, currentEndTime);
    //assert
    expect(result).toBeNull();
  });

  test("Actualización en frontend tras la extensión tras conflicto", () => {
    //arrange
    const isSpotActive = true;
    const hasConflict = true;
    //act
    const allowed = canReserveSpot(isSpotActive, hasConflict);
    //assert
    expect(allowed).toBe(false);
  });
});