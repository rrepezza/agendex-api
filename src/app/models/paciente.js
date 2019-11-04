const mongoose = require('../../db');
const bcrypt = require('bcryptjs');

const PacienteSchema = new mongoose.Schema({

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
        unique: true,
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
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});

PacienteSchema.pre('save', async function(fn){
    const hashedPwd = await bcrypt.hash(this.senha, 10);
    this.senha = hashedPwd;

    fn();
});

const Paciente = mongoose.model('Paciente', PacienteSchema);

module.exports = Paciente;