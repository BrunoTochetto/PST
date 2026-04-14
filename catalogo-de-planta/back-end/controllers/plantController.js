import db from '../db.js';

export const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, g.nome AS genero
      FROM plantas p
      LEFT JOIN genero g ON p.id_genero = g.id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM plantas WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Planta não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPlantEntry = async (req, res) => {
  try {
    const {
      nome_comum,
      id_genero,
      id_usuario,
      descricao,
      imagem_url
    } = req.body;

    const result = await db.query(`
      INSERT INTO plantas
      (nome_comum, id_genero, id_usuario, descricao, imagem_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nome_comum, id_genero, id_usuario, descricao, imagem_url]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_comum,
      id_genero,
      id_usuario,
      descricao,
      imagem_url
    } = req.body;

    const result = await db.query(`
      UPDATE plantas
      SET nome_comum = $1,
          id_genero = $2,
          id_usuario = $3,
          descricao = $4,
          imagem_url = $5
      WHERE id = $6
      RETURNING *
    `, [nome_comum, id_genero, id_usuario, descricao, imagem_url, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM plantas WHERE id = $1`,
      [id]
    );

    res.json({ message: "Planta deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
