# Session 17: Browser to Backend API

ParkHub demonstrates how a browser uses `fetch()` to exchange JSON with an Express API.

1. **Route:** Reads `req`, calls a service, and sends `res` with an HTTP status and JSON.
2. **Service:** Applies reservation rules and coordinates model operations.
3. **Model:** Defines a Mongoose schema and reads or writes MongoDB documents.
4. **Frontend flow:** `parking.js` calls `fetch()`, checks `response.ok`, reads JSON, and updates the page.
5. **GET `/api/spots`:** Browser → spot route → spot service → Mongoose models → MongoDB → JSON → spot cards. Availability checks the current time.
6. **POST `/api/reservations`:** Form → `fetch()` → reservation route → service validation and overlap check → models → MongoDB → `201` → success message. Repeating the same period returns `409` and a useful message.
7. **HTTP codes:** `200` for reads and cancellation, `201` for creation, `400` for bad input or period, `404` for a missing spot or reservation, `409` for an unavailable spot, and `500` for unexpected failures.
8. **UI states:** The spot list shows Loading, cards on Success, an Empty message, or an Error message. Reservation submission shows Success, Conflict, or a generic Error.
9. **Session 19 Jest examples:** `validateReservationPeriod()`, `hasTimeConflict()`, and `canReserveSpot()` are small exported rules. Their unit tests cover valid and invalid periods, touching boundaries, overlaps, and inactive spots. See [the Jest lesson](session-19-jest.md) for the scope of cancelled reservations.

For the class demo, seed the database, open the page, create a reservation that includes the current time, try the same period again, and cancel the first reservation. Refresh the spots to see current availability.
