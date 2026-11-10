import express from "express";
import multer from "multer";

import {
  getAll,
  getByID,
  createPlantEntry,
  updatePlant,
  deletePlant,
  getFirst36,
  getFirstN
} from "../controllers/plantController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de imagem não permitido"));
    }
  }
});

// Rotas públicas (consulta)
router.get("/", getAll);
router.get("/first36", getFirst36);
router.get("/limit/:count", getFirstN);
router.get("/:id", getByID);

// Rotas protegidas (criação, edição e exclusão exigem autenticação)
router.post("/", authenticateToken, upload.single("imagem"), createPlantEntry);
router.put("/:id", authenticateToken, updatePlant);
router.delete("/:id", authenticateToken, deletePlant);

export default router;
