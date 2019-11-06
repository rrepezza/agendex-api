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
    crm: {
        type: String,
        required: true,
    },
    especialidade: {
        type: String,
        required: true,
        lowercase: true,
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
            bairro: {
                type: String,
                required: true,
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