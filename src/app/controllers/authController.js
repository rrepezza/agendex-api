const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const config = require('../../config/auth.json');

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

router.post('./senha-esquecida', async(req, res) => {
    const { email } = req.body;

    try {
        const user = await Usuario.findOne({ email });

        if(!user) {
            res.status(400).send({ error: 'Usuário não encontrado.'});
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Usuario.findById(user.id, {
            '$set': {
                tokenResetSenha: token,
                resetSenhaExpiraEm: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'agendex@mail.com',
            template: 'auth/esqueci-minha-senha',
            context: { token },
        }, (err) => {
            if(err) {
                return res.status(400).send({ error: "Erro em esqueci minha senha."});
            }
        });
        
    } catch (error) {
        res.status(400).send({ error: 'Erro ao tentar recuperar a senha.'});
    }
});

router.post('./resetar-senha', async(req, res) => {
    const { email, token, senha } = req.body;

    try {

        const usuario = await Usuario.findOne({ email })
        .select('+tokenResetSenha resetSenhaExpiraEm');

        if(!usuario) {
            return res.status(400).send({ error: 'Usuário não encontrado.'});
        }

        if(token !== usuario.tokenResetSenha) {
            return res.status(400).send({ error: 'Token inválido.'});
        }

        const now = new Date();

        if(now > usuario.resetSenhaExpiraEm) {
            return res.status(400).send({ error: 'Token expirado.'});
        }

        usuario.senha = senha;

        await usuario.save();

        res.send();
        
    } catch (error) {
        res.status(400).send({ error: 'Não foi possível resetar a senha.'});
    }
});

module.exports = app => app.use('/auth', router);