const mongoose = require('../../db');
const bcrypt = require('bcryptjs');

const MedicoSchema = new mongoose.Schema({

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
    crm: {
        type: String,
        required: true,
    },
    endereco: [{
            cep: {
                type: String,
                required: true,
            },
            logradouro: {
                type: String,
                required: true,
            },
            numero: {
                type: Number,
            },
            complemento: {
                type: String,
            },
            cidade: {
                type: String,
                required: true,
            },
            uf: {
                type: String,
                required: true,
            },
        }
    ],
    senha: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: 'medico',
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});

MedicoSchema.pre('save', async function (fn) {
    const hashedPwd = await bcrypt.hash(this.senha, 10);
    this.senha = hashedPwd;

    fn();
});

const Medico = mongoose.model('Medico', MedicoSchema);

module.exports = Medico;