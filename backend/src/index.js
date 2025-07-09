import app from './app.js';
import { connectDB } from './db.js';
import { initializeSetup } from './libs/initialSetup.js';
import Role from './models/role.models.js';



const startServer = async () => {
    try {
        await connectDB(); // Espera a que se conecte la base de datos
        await initializeSetup(); // Luego crea los roles y el admin

        const roles = await Role.find();
        console.log('Roles en la base de datos: ', roles);

        app.listen(4001, () => {
            console.log('Servidor corriendo en el puerto 4001');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();