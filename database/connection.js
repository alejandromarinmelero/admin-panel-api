const mongoose = require('mongoose');
require('dotenv').config();

const Connection =  async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('conectado con exito');
    } catch (error) {
        console.log(`Error en la conexión:${error}`);
    }
}

module.exports = Connection;