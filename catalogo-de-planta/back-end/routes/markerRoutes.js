import express from 'express';
import {
  createMarker,
  getMarkersByPlant,
  getAllMarkers,
  getMarkerByID,
  deleteMarker
} from '../controllers/markerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas (consulta no mapa)
router.get('/', getAllMarkers);
router.get('/plant/:id', getMarkersByPlant);
router.get('/:id', getMarkerByID);

// Rotas protegidas (criação e exclusão exigem autenticação)
router.post('/', authenticateToken, createMarker);
router.delete('/:id', authenticateToken, deleteMarker);

export default router;
