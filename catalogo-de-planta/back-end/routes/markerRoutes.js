import express from 'express';
import {
  createMarker,
  getMarkersByPlant,
  getAllMarkers,
  getMarkerByID,
  deleteMarker
} from '../controllers/markerController.js';

const router = express.Router();

router.post('/', createMarker);
router.get('/', getAllMarkers);
router.get('/plant/:id', getMarkersByPlant);
router.get('/:id', getMarkerByID);
router.delete('/:id', deleteMarker);

export default router;