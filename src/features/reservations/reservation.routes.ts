import { Router } from 'express';
import * as reservationService from './reservation.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const reservations = await reservationService.getReservations();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load reservations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { parkingSpotId, startTime, endTime } = req.body ?? {};

    // TODO S17 PROF 3:
    // Crear la reservación utilizando el Service
    // y responder con 201 Created.
    res.status(501).json({ message: 'Pendiente de implementar en clase' });
  } catch (error) {
    if (error instanceof reservationService.ReservationError) {
      res.status(error.status).json({ message: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ message: 'Could not create reservation' });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const reservation = await reservationService.cancelReservation(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not cancel reservation' });
  }
});

export default router;
