import express from 'express';
import {
  getAllUsers,
  getUserByID,
  getMe,
  createUser,
  updateUser,
  deleteUser,
  validateUser
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/', createUser);
router.post('/validate', validateUser);
router.post('/login', validateUser);

// Rotas protegidas (exigem autenticação)
router.get('/me', authenticateToken, getMe);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserByID);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
