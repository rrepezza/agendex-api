const mongoose = require('../db');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: 'paciente',
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});

UsuarioSchema.pre('save', async function(fn){
    const hashedPwd = await bcrypt.hash(this.senha, 10);
    this.senha = hashedPwd;

    fn();
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;