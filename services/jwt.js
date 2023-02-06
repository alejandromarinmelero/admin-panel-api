//Importar dependencias
const jwt = require('jwt-simple')
const moment = require('moment')

//Clave secreta
const secret = "mY_dashBOARD_251262!";

//Funcion para generar token
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        address: user.address,
        city: user.city,
        country: user.country,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    //Devolver token codificado
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}