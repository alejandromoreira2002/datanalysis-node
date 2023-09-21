const mongoose = require('../config/db.js')

let UsuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fecha_creado: {
        type: Date,
        default: new Date()
    },
    rol: {
        type: String,
        default: "user"
    },
});

module.exports = mongoose.model('Usuario', UsuarioSchema)