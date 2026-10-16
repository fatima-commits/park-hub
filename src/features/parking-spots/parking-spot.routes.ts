import { Router } from 'express';
import * as parkingSpotService from './parking-spot.service';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // TODO S17 PROF 1:
    // Obtener los espacios desde el Service
    // y devolver la respuesta como JSON.
    res.status(501).json({ message: 'Pendiente de implementar en clase' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load parking spots' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const spot = await parkingSpotService.getSpotById(req.params.id);
    if (!spot) {
      res.status(404).json({ message: 'Parking spot not found' });
      return;
    }

    res.json(spot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load parking spot' });
  }
});

export default router;
