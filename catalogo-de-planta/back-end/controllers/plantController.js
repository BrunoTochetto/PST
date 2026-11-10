import db from '../db.js';
import cloudinary from "../config/cloudinary.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Garante que o diretório local de uploads exista
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const getAll = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, g.nome AS genero
      FROM plantas p
      LEFT JOIN genero g ON p.id_genero = g.id
      ORDER BY p.id ASC
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
      `SELECT p.*, g.nome AS genero
       FROM plantas p
       LEFT JOIN genero g ON p.id_genero = g.id
       WHERE p.id = $1`,
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
      descricao,
      latitude,
      longitude
    } = req.body;

    // Obtém o id_usuario autenticado via token, ou do corpo como fallback
    const id_usuario = req.user?.id || req.body.id_usuario || null;

    const imagem = req.file;

    if (!nome_comum || !nome_genero) {
      return res.status(400).json({
        error: "nome_comum e nome_genero são obrigatórios"
      });
    }

    if (!imagem && !req.body.imagem_url) {
      return res.status(400).json({
        error: "A imagem é obrigatória"
      });
    }

    // Normaliza gênero
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

    let imagem_url = req.body.imagem_url || "";

    if (imagem) {
      const hasCloudinary =
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

      if (hasCloudinary) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "wikiplant/plantas",
                resource_type: "image"
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

            uploadStream.end(imagem.buffer);
          });

          imagem_url = uploadResult.secure_url;
        } catch (cloudErr) {
          console.warn("Falha no Cloudinary, usando armazenamento local:", cloudErr.message);
        }
      }

      // Se não enviou para o Cloudinary (ou falhou), salva em disco localmente
      if (!imagem_url) {
        const fileExt = path.extname(imagem.originalname) || '.jpg';
        const sanitizedBase = path.basename(imagem.originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${Date.now()}-${sanitizedBase}${fileExt}`;
        const filePath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filePath, imagem.buffer);
        imagem_url = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      }
    }

    const result = await db.query(
      `INSERT INTO plantas
       (nome_comum, id_genero, id_usuario, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        nome_comum.trim(),
        id_genero,
        id_usuario,
        descricao || "",
        imagem_url
      ]
    );

    const createdPlant = result.rows[0];

    // Se latitude e longitude foram fornecidas no cadastro, insere o marcador
    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null && latitude !== '') {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        await db.query(
          `INSERT INTO marcadores (id_planta, latitude, longitude)
           VALUES ($1, $2, $3)`,
          [createdPlant.id, lat, lng]
        );
      }
    }

    res.status(201).json(createdPlant);

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
      descricao,
      imagem_url
    } = req.body;

    const id_usuario = req.user?.id || req.body.id_usuario;

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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Planta não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    // Deleta os marcadores vinculados e a planta
    await db.query(`DELETE FROM marcadores WHERE id_planta = $1`, [id]);
    const result = await db.query(`DELETE FROM plantas WHERE id = $1 RETURNING id`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Planta não encontrada" });
    }

    res.json({ message: "Planta deletada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFirst36 = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, g.nome AS genero
      FROM plantas p
      LEFT JOIN genero g ON p.id_genero = g.id
      ORDER BY p.id ASC
      LIMIT 36
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFirstN = async (req, res) => {
  try {
    const { count } = req.params;

    if (!count || isNaN(count) || count <= 0) {
      return res.status(400).json({ error: "Parâmetro count inválido" });
    }

    const result = await db.query(`
      SELECT p.*, g.nome AS genero
      FROM plantas p
      LEFT JOIN genero g ON p.id_genero = g.id
      ORDER BY p.id ASC
      LIMIT $1
    `, [count]);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
