const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Medico = require('../models/medico');

const router = express.Router();

//router.use(authMiddleware);

router.post('/', async (req, res) => {
    try {
        const medico = await Medico.create(req.body);
        return res.send({ medico });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar médico.'});
    }
});

router.put('/:medicoId', async (req, res) => {


    const idMedico = req.params.medicoId;
    const medicoAtualizado = req.body;

    try {

        const atualizado = await Medico.findByIdAndUpdate(idMedico, medicoAtualizado, {new : true});

        if(!atualizado) {
            return res.status(400).send({ error: 'Médico não encontrado.'});
        }

        return res.send(atualizado);
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao atualizar o médico.'});
    }
});


router.get('/', async (req, res) => {
    try {
        const medicos = await Medico.find();
        return res.send({ medicos });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao listar médicos.'});
    }
});


router.get('/:medicoId', async (req, res) => {
    try {
        const medico = await Medico.findById(req.params.medicoId);
        return res.send({ medico });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar o médico.'});
    }
});

router.get('/especialidade/:nomeEspecialidade', async (req, res) => {
    try {      
        const medicos = await Medico.find({ especialidade: req.params.nomeEspecialidade });
        return res.send({ medicos });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao buscar o médico pela especialidade informada.'});
    }
});

module.exports = app => app.use('/medicos', router);