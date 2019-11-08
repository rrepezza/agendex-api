const mongoose = require('../../db');

const AgendamentoSchema = new mongoose.Schema({

    dataAgendamento: {
        type: String,
        required: true,
    },
    horaAgendamento: {
        type: String,
        required: true,
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true,
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});


const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

module.exports = Agendamento;