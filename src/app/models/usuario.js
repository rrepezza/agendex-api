const mongoose = require('../../db');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({

    nomeCompleto: {
        type: String,
        required: true,
    },
    nomeSocial: {
        type: String,
    },
    rg: {
        type: String,
        required: true,
    },
    orgaoExpedidor: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    dataNascimento: {
        type: Date,
        required: true,
    },
    telefoneCelular: {
        type: String,
        required: true,    
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    sexo: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },
    tokenResetSenha: {
        type: String,
        select: false,
    },
    resetSenhaExpiraEm: {
        type:  Date,
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