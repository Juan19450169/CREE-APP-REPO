import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const roleSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: [ 'Administrador', 
                'Secretaria', 
                'Médico', 
                'Psicólogo/a', 
                'Terapeuta', 
                'Odontólogo/a', 
                'Fisioterapeuta'],
        required: true
    },
    guid: {
        type: String,
        default: uuidv4, //Se asigna automaticamente un GUID al crear el rol.
        unique: true
    }
 }, {
 timestamps: true
    
});
export default mongoose.model('Role',roleSchema);