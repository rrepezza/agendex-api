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
    /*
    cpfPaciente: {
        type: String,
        required: true,
    },
    nomeMedico: {
        type: String,
        required: true,
    },
    */
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

AgendamentoSchema.pre('save', async function(fn){
    const dataTratada = this.dataAgendamento.replace(/\//g, '-');
    this.dataAgendamento = dataTratada;

    fn();
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

module.exports = Agendamento;