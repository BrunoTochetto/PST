import db from '../db.js';

export const getAllGenera = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM genero`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGeneroByID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM genero WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createGenero = async (req, res) => {
  try {
    const { nome } = req.body;

    const result = await db.query(
      `INSERT INTO genero (nome) VALUES ($1) RETURNING *`,
      [nome]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGenero = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const result = await db.query(
      `UPDATE genero SET nome = $1 WHERE id = $2 RETURNING *`,
      [nome, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGenero = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM genero WHERE id = $1`, [id]);

    res.json({ message: "Gênero deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
