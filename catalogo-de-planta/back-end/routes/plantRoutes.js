import express from "express";
import multer from "multer";

import {
  getAll,
  getByID,
  createPlantEntry,
  deletePlant,
  getFirst36,
  getFirstN
} from "../controllers/plantController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
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

router.get("/", getAll);
router.get("/:id", getByID);
router.get("/first36", getFirst36);
router.get("/limit/:count", getFirstN);

router.post("/", upload.single("imagem"), createPlantEntry);

router.delete("/:id", deletePlant);

export default router;