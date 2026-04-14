import express from 'express';
import {
  createMarker,
  getMarkersByPlant
} from '../controllers/markerController.js';

const router = express.Router();

router.post('/', createMarker);
router.get('/plant/:id', getMarkersByPlant);

export default router;
