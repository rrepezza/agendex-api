const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Paciente = require('../models/paciente');
const Medico = require('../models/medico');
const Agendamento = require('../models/agendamento');

const router = express.Router();
//router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const agendamento = await Agendamento.create(req.body);        
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

router.get('/:medicoId/:dataAgendamento', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find({ medico: req.params.medicoId, dataAgendamento: req.params.dataAgendamento });
        const horasDisponiveis = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
        agendamentos.forEach(agendamento => {
            horasDisponiveis.splice(horasDisponiveis.indexOf(agendamento.horaAgendamento), 1);
        });        
        return res.send({ horasDisponiveis }) ;
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar agendamentos do médico informado nesta data.'});
    }
    
});

module.exports = app => app.use('/agendamentos', router);