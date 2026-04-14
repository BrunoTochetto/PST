import express from 'express';
import {
  getAllGenera,
  getGeneroByID,
  createGenero,
  updateGenero,
  deleteGenero
} from '../controllers/genController.js';

const router = express.Router();

router.get('/', getAllGenera);
router.get('/:id', getGeneroByID);
router.post('/', createGenero);
router.put('/:id', updateGenero);
router.delete('/:id', deleteGenero);

export default router;
