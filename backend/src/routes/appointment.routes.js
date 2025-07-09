import { Router } from "express";
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment, 
    getAvailableSlots,
    getDoctorAgenda,
    getCalendarioGeneral
} from '../controllers/appointment.controller.js';
import { authRequired } from "../moddlewares/validateToken.js";
import { requireRole } from "../moddlewares/requireRole.js";

const router = Router();

//crear cita (SOLO SECRETARIA)
router.post('/', authRequired, requireRole('Secretaria'), createAppointment);

//obtener todas las citas (SOLO ESPECIALISTAS O ADMIN)
router.get('/', authRequired, requireRole('Administrador','Médico','Psicólogo/a','Terapeuta','Odontólogo/a','Fisioterapeuta'), getAppointments);

//Obtener una cita por ID (Especialistas, secretarias, admin)
router.get('/:id', authRequired, requireRole('Administrador','Secretaria','Médico','Psicólogo/a','Terapeuta','Odontólogo/a','Fisioterapeuta'), getAppointmentById);

//Actualizar una cita por ID (Solo secretaria)
router.put('/:id', authRequired, requireRole('Secretaria'),updateAppointment);

//Eliminar una cia por ID(Solo admin)
router.delete('/:id', authRequired, requireRole('Administrador'), deleteAppointment);

//Obtener horarios disponibles
router.get('/available-slots', authRequired, requireRole(
    'Administrador',
    'Secretaria',
    'Médico',
    'Psicólogo/a',
    'Terapeuta',
    'Odontólogo/a',
    'Fisioterapeuta'
), getAvailableSlots);

// Obtener agenda diaria del doctor logueado
router.get('/doctor/agenda', authRequired, requireRole(
    'Médico', 
    'Psicólogo/a', 
    'Terapeuta', 
    'Odontólogo/a', 
    'Fisioterapeuta'), getDoctorAgenda);


router.get('/claendario/general',authRequired,requireRole('Secretaria'),getCalendarioGeneral);


export default router;