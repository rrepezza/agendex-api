const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Paciente = require('../models/paciente');
const Medico = require('../models/medico');
const Agendamento = require('../models/agendamento');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const agendamento = await Agendamento.create({ ...req.body, paciente: req.pacienteId, medico: req.medicoId });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao inserir agendamento.'});
    }
});

router.get('/', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find().populate(['paciente', 'medico']);
        return res.send({ agendamentos });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao listar agendamentos.'});
    }
});

router.get('/:pacienteId', async (req, res) => {
    try {
        const paciente = await Paciente.findById(req.params.pacienteId);
        return res.send({ paciente });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar o paciente.'});
    }
});

module.exports = app => app.use('/pacientes', router);