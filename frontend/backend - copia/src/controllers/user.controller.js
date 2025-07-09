// controllers/user.controller.js
import User from '../models/user.models.js';
import Role from '../models/role.models.js';

// Crear nuevo usuario (solo admins)
export const createUser = async (req, res) => {
    const {
        username,
        email,
        password,
        role,
        areaAsignada,
        doctorAsignado
    } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ msg: 'El correo ya está registrado' });
            
        //Buscar documento del rol

        const roleDoc = await Role.findOne({ role });
        if (!roleDoc){
            return res.status(400).json({ msg: 'Rol no valido' });
        }

        const newUser = new User({
            username,
            email,
            password, // El modelo lo hasheará automáticamente
            role: roleDoc._id,
            areaAsignada: areaAsignada || null,
            doctorAsignado: doctorAsignado || null
        });

        const userSaved = await newUser.save();

        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            role: role,
            areaAsignada: userSaved.areaAsignada,
            doctorAsignado: userSaved.doctorAsignado,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear usuario' });
    }
};

// Obtener todos los usuarios (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // sin contraseñas
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
};

// Editar usuario (admin)
export const updateUser = async (req, res) => {
    try {
        const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select("-password");

        if (!userUpdated)
            return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(userUpdated);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
};

// Eliminar usuario (admin)
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser)
            return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};
//ASIGANAR ESPECIALISTA A SECRETARIA EN ESPECIFICO
export const assignSpecialist = async (req, res) => {
    const { secretariaId, doctorId } = req.body;

    try {
        const secretaria = await User.findById(secretariaId);
        const doctor = await User.findById(doctorId);

        if (!secretaria || !doctor)
            return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Verificar que secretaria tenga rol correcto
        const secretariaRole = await Role.findById(secretaria.role);
        const doctorRole = await Role.findById(doctor.role);

        if (!secretariaRole || secretariaRole.role !== 'Secretaria')
            return res.status(400).json({ msg: 'El usuario destino no es una secretaria' });

        const validRoles = ['Médico', 'Psicólogo/a', 'Terapeuta', 'Odontólogo/a', 'Fisioterapeuta'];
        if (!doctorRole || !validRoles.includes(doctorRole.role))
            return res.status(400).json({ msg: 'El usuario a asignar no es un especialista válido' });

        // Evitar duplicados
        if (secretaria.doctorAsignado.includes(doctor._id)) {
            return res.status(400).json({ msg: 'Este especialista ya está asignado a la secretaria' });
        }

        secretaria.doctorAsignado.push(doctor._id);
        await secretaria.save();

        res.json({ msg: 'Especialista asignado correctamente a la secretaria' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al asignar especialista' });
    }
};

