const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Paciente = require('../models/paciente');
const Medico = require('../models/medico');
const Agendamento = require('../models/agendamento');

const router = express.Router();

//router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const agendamento = await Agendamento.create({...req.body, paciente: req.body.paciente, medico: req.body.medico});

        return res.send({agendamento});
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

router.get('/:agendamentoId', async (req, res) => {
    try {
        const agendamento = await Agendamento.findById(req.params.agendamentoId).populate(['paciente', 'medico']);
        return res.send({ agendamento });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar o agendamento.'});
    }
});

module.exports = app => app.use('/agendamentos', router);