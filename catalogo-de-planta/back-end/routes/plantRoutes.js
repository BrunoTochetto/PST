import express from 'express';
import {
  getAll,
  getByID,
  createPlantEntry,
  deletePlant
} from '../controllers/plantController.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getByID);
router.post('/', createPlantEntry);
router.delete('/:id', deletePlant);

export default router;
