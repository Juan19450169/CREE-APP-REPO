import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    pacienteName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
      },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
      },      
    area: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    creadaPor: {                                            //SECRETARIA QUE AGENDO LA CITA
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },                                                              
    estado: {
        type: String,
        enum: ['pendiente', 'completada', 'cancelada'],
        default: 'pendiente'
    }
}, {
    timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
