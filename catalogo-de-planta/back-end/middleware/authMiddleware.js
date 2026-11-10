import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-wikiplant-2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nome: user.nome,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
