import { Router } from "express";
import {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    assignSpecialist
} from '../controllers/user.controller.js';
import { authRequired } from "../moddlewares/validateToken.js";
import { requireRole } from "../moddlewares/requireRole.js";
import { getAllRoles } from "../controllers/role.controller.js";

const router = Router();

//TODAS LAS RUTAS PROTEGIDAS PARA ADMIN

//CREAR USUARIO
router.post('/', authRequired, requireRole('Administrador'), createUser);

//EDITAR USUARIO
router.put('/:id', authRequired, requireRole('Administrador'), updateUser);

//ELIMINAR USUARIO
router.delete('/:id', authRequired, requireRole('Administrador'), deleteUser);

//MOSTRAR TODOS LOS USUARIOS 
router.get('/', authRequired, requireRole('Administrador'), getAllUsers);

//ASIGNAR ESPECIALISTA A SECRETARIA 
router.put('/asignar-especialista/:secretariaId', authRequired, requireRole('Administrador'), assignSpecialist);

// OBTENER TODOS LOS ROLES 
router.get('/roles', authRequired, requireRole('Administrador'), getAllRoles);

export default router;