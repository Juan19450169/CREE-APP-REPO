import Role from '../models/role.models.js';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({}, 'role _id'); // solo trae los campos que necesitas
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ msg: 'Error al obtener roles' });
    }
};
