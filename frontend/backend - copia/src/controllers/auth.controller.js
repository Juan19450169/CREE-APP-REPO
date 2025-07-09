//IMPORTAMOS EL MODELO DE DATOS 
import User from '../models/user.models.js';
import { createAccessToken } from '../libs/jwt.js';
import Role from '../models/role.models.js';

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email })
        .populate({
            path:'role',
            select: 'role'
        });
        console.log('Role completo:', userFound.role.role);
        console.log('Nombre del rol:', userFound.role.role);
        if (!userFound)
            return res.status(400).json({ msg: 'Correo no registrado' });

        const isMatch = await userFound.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = await createAccessToken({
            id: userFound._id,
            role: userFound.role.role,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 // 2 horas
        });

        res.json({
            user: {
                id: userFound._id,
                username: userFound.username,
                email: userFound.email,
                role: userFound.role.role,
                areaAsignada: userFound.areaAsignada,
                doctorAsignado: userFound.doctorAsignado
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

// PERFIL
export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id);
        if (!userFound)
            return res.status(400).json({ msg: 'Usuario no encontrado' });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            areaAsignada: userFound.areaAsignada,
            doctorAsignado: userFound.doctorAsignado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al obtener perfil' });
    }
};
