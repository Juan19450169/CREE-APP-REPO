import Role from '../models/role.models.js';
import User from '../models/user.models.js';
import dotenv from 'dotenv';
import { createRoles } from '../utils/createRoles.js';

export const initializeSetup = async () => {
    
    try {
        dotenv.config();

        //Crea roles si no existen
        await createRoles();

        const roleadmin = process.env.SETUP_ROLE_ADMIN;
        const setupAdminName = process.env.SETUP_ADMIN_USERNAME;
        const setupPwd = process.env.SETUP_ADMIN_PWD;
        const setupEmail = process.env.SETUP_ADMIN_EMAIL;

        // Verificar si ya existe un usuario admin
        const userAdmin = await User.findOne({ username: setupAdminName });

        if (!userAdmin) {
            console.log("Creando el usuario administrador");

            const roleAdminDoc = await Role.findOne({ role: roleadmin });

            if (!roleAdminDoc) {
                console.error("Rol de administrador no encontrado en la BD");
                return;
            }

        

            const newUserAdmin = new User({
                username: setupAdminName,
                email: setupEmail,
                password: setupPwd,
                role: roleAdminDoc._id
            });

            await newUserAdmin.save();
        }

        console.log("Administrador inicial creado correctamente");

    } catch (error) {
        console.error("Error en initializeSetup:", error);
    }
};
