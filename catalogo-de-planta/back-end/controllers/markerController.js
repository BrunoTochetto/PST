import db from '../db.js';

export const getAllMarkers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM marcadores`);
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

    const result = await db.query(
      `INSERT INTO marcadores (id_planta, latitude, longitude)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_planta, latitude, longitude]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMarker = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM marcadores WHERE id = $1`,
      [id]
    );

    res.json({ message: "Marcador deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
