import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//importamos las rutas para usuarios 
import authRoutes from './routes/auth.routes.js';
import appointmentsRoutes from './routes/appointment.routes.js';
import userRoutes from './routes/user.routes.js';
import testRoleRoutes from './routes/testRole.routes.js';


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

//Indicamos que el servidor utilice el objeto authRouthes
app.use('/api/', authRoutes); //Ruta de autentificacion 
app.use('/api/appointments', appointmentsRoutes);  //Ruta de citas
app.use('/api/user', userRoutes); //Ruta de creacion de usuarios 
app.use('/api', testRoleRoutes);//esto habilita /api/roles

export default app;
