import Role from '../models/role.models.js';

export const createRoles = async ()=>{
    try {
        console.log('Verificando si existen roles... ');

        const count = await Role.estimatedDocumentCount();
        if (count > 0) {
            console.log('Roles ya existen, no se crea nada');
            return; //Ya hay roles no hace nada
        } 

        const roles = [
            'Administrador',
            'Secretaria',
            'Médico',
            'Psicólogo/a',
            'Terapeuta',
            'Odontólogo/a',
            'Fisioterapeuta'
        ];

        await Promise.all(
            roles.map(roleName => new Role({ role: roleName }).save())
        );

        console.log('ROLES CREADOS CORRECTAMENTE')
    } catch (error) {
        console.error('Error al crear los roles: ', error);
    }
}