import db from '../db.js';

export const getAllMarkers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM marcadores ORDER BY id ASC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMarkerByID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM marcadores WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Marcador não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMarkersByPlant = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM marcadores WHERE id_planta = $1`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMarker = async (req, res) => {
  try {
    const { id_planta, latitude, longitude } = req.body;

    if (!id_planta || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "id_planta, latitude e longitude são obrigatórios" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Latitude e longitude devem ser números válidos" });
    }

    // Evita duplicação caso a criação da planta já tenha inserido o marcador nas mesmas coordenadas
    const existing = await db.query(
      `SELECT * FROM marcadores
       WHERE id_planta = $1
         AND ABS(latitude - $2) < 0.000001
         AND ABS(longitude - $3) < 0.000001`,
      [id_planta, lat, lng]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json(existing.rows[0]);
    }

    const result = await db.query(
      `INSERT INTO marcadores (id_planta, latitude, longitude)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_planta, lat, lng]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMarker = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM marcadores WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Marcador não encontrado" });
    }

    res.json({ message: "Marcador deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
