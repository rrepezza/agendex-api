const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const config = require('../../config/auth.json');

const Paciente = require('../models/paciente');

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

        if(await Paciente.findOne({ email })) {
            return res.status(400).send({ error: 'Paciente já está registrado.' });
        }

        const paciente = await Paciente.create(req.body);

        paciente.senha = undefined;

        return res.send({ 
            paciente,
            token: gerarToken({ id: paciente.id }),
        });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao cadastrar.' });
    }
});

router.post('/login', async(req, res) => {
    const { cpf, senha } = req.body;

    const paciente = await Paciente.findOne({ cpf }).select('+senha');

    if(!paciente) {
        return res.status(400).send({ error : 'Paciente não encontrado.'});
    }

    if(!await bcrypt.compare(senha, paciente.senha)) {
        return res.status(400).send({ error: 'Senha inválida.'});
    }

    paciente.senha = undefined;

    res.send({
        paciente,
        token: gerarToken({ id: paciente.id }),
    })
});

router.post('./senha-esquecida', async(req, res) => {
    const { email } = req.body;

    try {
        const paciente = await Paciente.findOne({ email });

        if(!paciente) {
            res.status(400).send({ error: 'Paciente não encontrado.'});
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await Paciente.findById(paciente.id, {
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

        const paciente = await Paciente.findOne({ email })
        .select('+tokenResetSenha resetSenhaExpiraEm');

        if(!paciente) {
            return res.status(400).send({ error: 'Usuário não encontrado.'});
        }

        if(token !== paciente.tokenResetSenha) {
            return res.status(400).send({ error: 'Token inválido.'});
        }

        const now = new Date();

        if(now > paciente.resetSenhaExpiraEm) {
            return res.status(400).send({ error: 'Token expirado.'});
        }

        paciente.senha = senha;

        await paciente.save();

        res.send();
        
    } catch (error) {
        res.status(400).send({ error: 'Não foi possível resetar a senha.'});
    }
});

module.exports = app => app.use('/auth', router);