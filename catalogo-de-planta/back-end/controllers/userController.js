import db from '../db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, nome, email, cep FROM usuarios ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id, nome, email, cep FROM usuarios WHERE id = $1`,
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

export const getMe = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, nome, email, cep FROM usuarios WHERE id = $1`,
      [req.user.id]
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
    const { nome, email, cep, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "Nome, email e senha são obrigatórios"
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Verifica se usuário já existe
    const existing = await db.query(
      `SELECT id FROM usuarios WHERE LOWER(email) = $1`,
      [emailNormalizado]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        error: "Email já cadastrado"
      });
    }

    // Hash da senha com bcrypt (10 rounds de salt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const result = await db.query(
      `INSERT INTO usuarios (nome, email, cep, senha)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, cep`,
      [nome.trim(), emailNormalizado, cep || null, hashedPassword]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: newUser,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, cep, senha } = req.body;

    // Se a senha foi informada, faz hash da nova senha
    let result;
    if (senha && senha.trim() !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      result = await db.query(
        `UPDATE usuarios
         SET nome = $1, email = $2, cep = $3, senha = $4
         WHERE id = $5
         RETURNING id, nome, email, cep`,
        [nome, email ? email.trim().toLowerCase() : null, cep, hashedPassword, id]
      );
    } else {
      result = await db.query(
        `UPDATE usuarios
         SET nome = $1, email = $2, cep = $3
         WHERE id = $4
         RETURNING id, nome, email, cep`,
        [nome, email ? email.trim().toLowerCase() : null, cep, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`DELETE FROM usuarios WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ valid: false, error: "Email e senha são obrigatórios" });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Busca o usuário apenas pelo email
    const result = await db.query(
      `SELECT id, nome, email, cep, senha FROM usuarios WHERE LOWER(email) = $1`,
      [emailNormalizado]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ valid: false, error: "Email ou senha incorretos" });
    }

    const user = result.rows[0];

    // Compara senha fornecida com o hash bcrypt armazenado
    const passwordMatch = await bcrypt.compare(senha, user.senha);

    if (!passwordMatch) {
      return res.status(401).json({ valid: false, error: "Email ou senha incorretos" });
    }

    // Gera token JWT de autenticação real
    const token = generateToken(user);

    // Remove hash da senha do objeto de resposta
    const safeUser = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cep: user.cep,
    };

    res.json({
      valid: true,
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
};
