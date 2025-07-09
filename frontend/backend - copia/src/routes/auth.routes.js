import { Router } from 'express';
import { login,logout, profile } from '../controllers/auth.controller.js';
import { authRequired } from '../moddlewares/validateToken.js';
import { requireRole } from '../moddlewares/requireRole.js';

const router = Router();

// Rutas sin restricciones
router.post('/login', login);
router.post('/logout', logout);

//Ruta de perfil requiere autentificacion
router.get('/profile', authRequired, profile);

router.get('/adminProfile', authRequired,requireRole('Administrador'), profile);

export default router;
