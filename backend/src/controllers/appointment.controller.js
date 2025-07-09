import Appointment from '../models/appointment.models.js';
import User from '../models/user.models.js';
import moment from 'moment'; 

// Crear cita con validación de conflicto
export const createAppointment = async (req, res) => {
    const { pacienteName, fecha, hora, area, doctor } = req.body;

    try {
        // Validar conflicto de horario con mismo doctor
        const conflict = await Appointment.findOne({
            fecha,
            hora,
            doctor
        });

        if (conflict) {
            return res.status(400).json({ msg: "Ya existe una cita para ese doctor en esa fecha y hora." });
        }

        const newAppointment = new Appointment({
            pacienteName,
            fecha,
            hora,
            area,
            doctor,
            creadaPor: req.user.id
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear la cita" });
    }
};

// Obtener todas las citas (con filtros opcionales)
export const getAppointments = async (req, res) => {
    const { doctor, area, estado } = req.query;

    const filter = {};
    if (doctor) filter.doctor = doctor;
    if (area) filter.area = area;
    if (estado) filter.estado = estado;

    try {
        const appointments = await Appointment.find(filter)
            .populate('doctor', 'username email role')
            .populate('creadaPor', 'username email');

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las citas' });
    }
};

// Obtener una cita por ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('doctor', 'username email role')
            .populate('creadaPor', 'username email');

        if (!appointment)
            return res.status(404).json({ msg: 'Cita no encontrada' });

        res.json(appointment);

    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la cita' });
    }
};

// Editar cita
export const updateAppointment = async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!updated)
            return res.status(404).json({ msg: 'Cita no encontrada' });

        res.json(updated);

    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la cita' });
    }
};

// Eliminar cita
export const deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);

        if (!deleted)
            return res.status(404).json({ msg: 'Cita no encontrada' });

        res.sendStatus(204); // Sin contenido

    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la cita' });
    }
};

// Obtener horarios disponibles para un doctor en una fecha
export const getAvailableSlots = async (req, res) => {
    const { doctor, fecha } = req.query;

    if (!doctor || !fecha) {
        return res.status(400).json({ msg: 'El doctor y la fecha son obligatorios' });
    }

    try {
        const startHour = 8;
        const endHour = 16;
        const slotDuration = 30; // minutos

        const workStart = moment(`${fecha} ${startHour}:00`, 'YYYY-MM-DD HH:mm');
        const workEnd = moment(`${fecha} ${endHour}:00`, 'YYYY-MM-DD HH:mm');

        const appointments = await Appointment.find({ doctor, fecha });

        const slots = [];
        let current = workStart.clone();

        while (current < workEnd) {
            const end = current.clone().add(slotDuration, 'minutes');
            const timeStr = current.format('HH:mm');

            const isOccupied = appointments.some(app => app.hora === timeStr);

            if (!isOccupied) {
                slots.push({
                    hora: timeStr,
                    hasta: end.format('HH:mm')
                });
            }

            current = end;
        }

        res.json({ availableSlots: slots });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los horarios disponibles' });
    }
};

//Solicitar AGENDA DEL DIA
export const getDoctorAgenda = async (req, res) =>{
        const doctorId =req.user.id; //EL ID DEL DOCTOR ES EL ESPECIALISTA LOGUEADO
        const { fecha } = req.query; 

        const date = fecha ? moment(fecha, 'YYYY-MM-DD').startOf('day') : moment().startOf('day');


        try {
            //Filtrar citas solo para el doctor logueado
            const appointments = Appointment.find({
                doctor: doctorId,
                fecha: date.format('YYYY-MM-DD')
            }).populate('creadaPor', 'username email');

            if (appointments.length ===0){
                return res.status(404).json({ msg: 'No tienes citas para esta fecha' });
            }

            res.json(appointments);

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al obtener las citas' });
        }
};

//Solicitar Calendario general 
export const getCalendarioGeneral = async (req, res) => {
    const { fecha, area, doctor } = req.query;

    let filtros = {};

    if (fecha) {
        const start = new Date(fecha);
        const end = new Date(fecha);
        end.setHours(23, 59, 59, 999);
        filtros.fecha = { $gte: start, $lte: end };
    }

    if (area) filtros.area = area;
    if (doctor) filtros.doctor = doctor;

    try {
        const citas = await Appointment.find(filtros)
            .populate('doctor')
            .populate('paciente')
            .populate('area');

        res.json(citas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener calendario general' });
    }
};
