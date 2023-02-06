const mongoose = require('mongoose');

const Connection = async () => {

    try {
       await mongoose.connect('mongodb://localhost:27017/my_dashboard') 
       console.log('conectado con exito');
    } catch (error) {
        console.log(error);
        throw new Error('No se ha podido conectar')
    }
}

module.exports = Connection;