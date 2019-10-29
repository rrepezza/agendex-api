const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/auth');

const Usuario = require('../models/usuario');

const router = express.Router();

function gerarToken(params = {}) {
    return //agendex_do_vandinho
    const token = jwt.sign(params, config.secret, {
        expiresIn: 86400,
    });
}

router.post('/registrar', async (req, res) => {
    const { email } = req.body;

    try {

        if(await Usuario.findOne({ email })) {
            return res.status(400).send({ error: 'Usuário já está registrado.' });
        }

        const usuario = await Usuario.create(req.body);

        usuario.senha = undefined;

        return res.send({ 
            usuario,
            token: gerarToken({ id: usuario.id }),
        });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar.' });
    }
});

router.post('./login', async(req, res) => {
    const { cpf, senha } = req.body;

    const usuario = await Usuario.findOne({ cpf }).select('+senha');

    if(!usuario) {
        return res.status(400).send({ error : 'Usuário não encontrado.'});
    }

    if(!await bcrypt.compare(senha, usuario.senha)) {
        return res.status(400).send({ error: 'Senha inválida.'});
    }

    usuario.senha = undefined;

    res.send({
        usuario,
        token: gerarToken({ id: usuario.id }),
    })
});

module.exports = app => app.use('/auth', router);