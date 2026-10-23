# ParkHub

ParkHub is a small parking reservation app for Session 17 of **Tecnologías de el servidor**. It demonstrates a browser calling a backend API with `fetch()` and a simple Route → Service → Model structure.

## Stack

Node.js, Express, TypeScript, MongoDB, Mongoose, and vanilla HTML, CSS, and JavaScript.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` if you want to change the defaults.
3. Start MongoDB: `docker compose up -d` (or use an existing MongoDB server).
4. Add sample spots: `npm run seed`
5. Start the app: `npm run dev`
6. Open <http://localhost:3000>.

For a compiled run, use `npm run build` followed by `npm start`. Run commands from the project root so Express can serve `src/public`.

## Testing

Run the Session 19 unit tests with `npm test`. Use `npm run test:watch` while editing tests.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Web server port |
| `MONGODB_URI` | `mongodb://localhost:27017/parkhub` | MongoDB connection |

## Structure

```text
src/
  features/
    parking-spots/   # Model, Service, Route
    reservations/    # Model, rules, Service, Route
  public/            # Browser page, CSS, and fetch() code
  config/env.ts      # Environment values
  app.ts             # Express setup
  server.ts          # Database connection and listener
  seed.ts            # Five sample parking spots
```

Routes handle HTTP, services contain business rules and call models, and models define MongoDB documents. `reservation.rules.ts` contains the pure functions tested in [Session 19](docs/session-19-jest.md).

## API

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/spots` | Active spots with `id`, `number`, `zone`, `type`, `active`, `available` |
| GET | `/api/spots/:id` | One spot or `404` |
| POST | `/api/reservations` | New reservation (`201`) or validation/conflict error |
| GET | `/api/reservations` | Reservations, including cancelled ones |
| PATCH | `/api/reservations/:id/cancel` | Updated reservation or `404` |

Example POST body:

```json
{
  "parkingSpotId": "SPOT_ID_FROM_GET_API_SPOTS",
  "startTime": "2026-10-08T12:00:00.000Z",
  "endTime": "2026-10-08T13:00:00.000Z"
}
```

## Business rules

- Start must be before end.
- A reservation needs an existing, active spot.
- Active reservations on the same spot cannot overlap: `newStart < existingEnd && newEnd > existingStart`.
- Cancelled reservations do not block a spot.
- `available` describes **right now**: an active reservation blocks the spot when `startTime <= now && endTime > now`.

The conflict check is intentionally a simple read followed by a write, suitable for the class demo. Simultaneous requests could pass that check before either write completes.
