import db from '../db.js';
import cloudinary from "../config/cloudinary.js";

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
      nome_genero,
      id_usuario,
      descricao
    } = req.body;

    const imagem = req.file;

    if (!nome_comum || !nome_genero) {
      return res.status(400).json({
        error: "nome_comum e nome_genero são obrigatórios"
      });
    }

    if (!imagem) {
      return res.status(400).json({
        error: "A imagem é obrigatória"
      });
    }

    const generoNormalizado = nome_genero.trim().toLowerCase();

    let generoResult = await db.query(
      `SELECT id FROM genero WHERE LOWER(nome) = $1 LIMIT 1`,
      [generoNormalizado]
    );

    let id_genero;

    if (generoResult.rows.length > 0) {
      id_genero = generoResult.rows[0].id;
    } else {
      const novoGenero = await db.query(
        `INSERT INTO genero (nome)
         VALUES ($1)
         RETURNING id`,
        [nome_genero.trim()]
      );

      id_genero = novoGenero.rows[0].id;
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "wikiplant/plantas",
          resource_type: "image"
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(imagem.buffer);
    });

    const imagem_url = uploadResult.secure_url;

    const result = await db.query(
      `INSERT INTO plantas
       (nome_comum, id_genero, id_usuario, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        nome_comum,
        id_genero,
        id_usuario,
        descricao,
        imagem_url
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Erro ao cadastrar planta:", err);

    res.status(500).json({
      error: err.message
    });
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


export const getFirst36 = async (req, res) => {
  try {

    const result = await db.query(
      `SELECT * FROM plantas LIMIT 36`
    );

    res.json(result.rows);

  }catch (err) {
    res.status(500).json({error: err.message});
  }
}


export const getFirstN = async (req, res) => {
  try {

    const { count } = req.params;

    if (!count || isNaN(count) || count <= 0) {
      return res.status(400).json({ error: "faz favor né bicho" });
    }

    const result = await db.query(
      `SELECT * FROM plantas LIMIT $1`,
      [count]
    );

    res.json(result.rows);

  }catch (err) {
    res.status(500).json({error: err.message});
  }
}


