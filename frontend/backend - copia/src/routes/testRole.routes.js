import { Router  } from "express";
import Role from '../models/role.models.js';

const router = Router();

//Ruta para obtener todos los roles (solo para pruebas)

router.get('/roles', async (req, res) => {
    try {
      const roles = await Role.find();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener los roles' });
    }
  });
  
  export default router;