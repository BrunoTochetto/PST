import db from '../db.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM usuarios`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM usuarios WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nome, email, cep } = req.body;

    const result = await db.query(
      `INSERT INTO usuarios (nome, email, cep)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, email, cep]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cep } = req.body;

    const result = await db.query(
      `UPDATE usuarios
       SET nome = $1, email = $2, cep = $3
       WHERE id = $4
       RETURNING *`,
      [nome, email, cep, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM usuarios WHERE id = $1`, [id]);

    res.json({ message: "Usuário deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
