const mongoose = require('mongoose');
require('dotenv').config();

const Connection =  () => {
    try {
       mongoose.connect(process.env.MONGODB_URI);
       console.log('conectado con exito');
    } catch (error) {
        console.log(error);
        throw new Error('No se ha podido conectar')
    }
}

module.exports = Connection;