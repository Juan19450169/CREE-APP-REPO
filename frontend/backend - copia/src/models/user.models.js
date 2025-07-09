import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        ref: 'Role',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    areaAsignada: {                                         //Opcional para secretarias y Especialistas
        type: String,
        trim: true
    },
    doctorAsignado:[{                                       //Solo si la secreatia tiene un doctor asignado
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]

}, {
    timestamps: true                                     //Pra tener createdAt y updateAt automaticos 
});

//MIDDLEWARE PARA HASHEAR CONTRASEÑAS ANTES DE GURDAR 

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    
});

//METODO PARA COMPARAR CONTRASEÑAS

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);