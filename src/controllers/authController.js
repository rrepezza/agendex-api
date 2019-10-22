const express = require('express');

const Usuario = require('../models/usuario');

const router = express.Router();

router.post('/registrar', async (req, res) => {
    const { email } = req.body;

    try {

        if(await Usuario.findOne({ email })) {
            return res.status(400).send({ error: 'Usuário já está registrado.' });
        }

        const usuario = await Usuario.create(req.body);

        usuario.senha = undefined;

        return res.send({ usuario });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar.' });
    }
});

module.exports = app => app.use('/auth', router);