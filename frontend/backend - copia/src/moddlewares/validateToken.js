import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

// Middleware para proteger rutas privadas
export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;
  
    const token = tokenFromHeader || req.cookies.token;
  
    if (!token)
      return res.status(401).json({ msg: 'No token. Autorización denegada.' });
  
    try {
      const decoded = jwt.verify(token, TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ msg: 'Token inválido o expirado.' });
    }
  };
  
