//Importar dependencias o módulos
const jwt = require('jwt-simple')
const moment = require('moment')

//Importar clave secreta
const libJwt = require('../services/jwt')
const secret = libJwt.secret;

//Middleware de autenticación: se ejecuta entre la ruta y el controlador
exports.auth = (req, res, next) => { //Next permite saltar a la ejecucion del controlador una vez que se haya ejecutado el middleware

    //Comprobar si me llega la cabecera de autenticación
    if (!req.headers.authorization) {
        res.status(400).send({
            status: 'error',
            message: 'La petición no tiene la cabecera de autenticación'
        })
    }

    //Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    //Decodificar el token
    try {
        let payload = jwt.decode(token, secret)

        //Comprobar expiración del token
        if (payload.exp <= moment().unix()) {
            res.status(401).send({
                status: 'error',
                message: 'Token expirado'
            })
        }

        //Agregar datos de usuario a la request
        req.user = payload;

    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'Token invalido'
        })
    }

    //Pasar a la ejecucion del controlador
    next();

}