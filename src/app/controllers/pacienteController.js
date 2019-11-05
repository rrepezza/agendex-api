const express = require('express');
const authMiddleware = require('../middlewares/auth')

const Paciente = require('../models/paciente');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        return res.send({ pacientes });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao listar pacientes.'});
    }
});

router.get('/:pacienteId', async (req, res) => {
    res.send({ paciente: req.pacienteId });
});

router.put('/:pacienteId', async (req, res) => {
    res.send({ paciente: req.pacienteId });
});

router.delete('/:pacienteId', async (req, res) => {
    res.send({ paciente: req.pacienteId });
});

module.exports = app => app.use('/pacientes', router);