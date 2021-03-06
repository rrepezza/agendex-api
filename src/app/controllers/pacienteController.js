const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Paciente = require('../models/paciente');

const router = express.Router();

//router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        return res.send(pacientes);
    } catch (error) {        
        return res.status(400).send({ error: 'Erro ao listar pacientes.'});
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

router.put('/:pacienteId', async (req, res) => {

    const idPaciente = req.params.pacienteId;
    const pacienteAtualizado = req.body;

    try {

        const atualizado = await Paciente.findByIdAndUpdate(idPaciente, pacienteAtualizado, {new : true});

        if(!atualizado) {
            return res.status(400).send({ error: 'Paciente não encontrado.'});
        }

        return res.send(atualizado);
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao atualizar o paciente.'});
    }
});

router.get('/cpf/:cpf', async (req, res) => {
    try {
        const paciente = await Paciente.find({cpf: req.params.cpf});
        return res.send({ paciente });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar o paciente.'});
    }
});

module.exports = app => app.use('/pacientes', router);