const jwt = require('jsonwebtoken');
const config = require('../config/auth')

module.exports = (req, res, next) => {
    const authReader = req.headers.authorization;

    if(!authReader) {
        return res.status(401).send({ error: 'Não há token disponível.'});
    }

    const parts = authReader.split(' ');

    if(!parts.lenght === 2) {
        return res.status(401).send({ error: 'Token com erro.'});
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer^$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token mal formatado.'});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({ error: 'Token inválido.'});
        }

        req.userId = decoded.id;

        return next();

    });
};