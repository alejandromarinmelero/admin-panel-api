// importar dependencias
const connection = require('./database/connection');
const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notesRoutes')
const userRoutes = require('./routes/userRoutes')

//Conexión a la base de datos
connection();

//Crear servidor Node
const app = express()
const puerto = 3900;

//Configurar cors
app.use(cors());

//Convertir los datos del body a objetos JSON
app.use(express.json())
//Convertir a objeto JSON cualquier formulario que se envie con el formato form.urlencoded
app.use(express.urlencoded({extended: true}));

//Cargar configuracion de rutas
app.use('/api/notes', notesRoutes);
app.use('/api/users', userRoutes);

//Poner el servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log(`Servidor de node corriendo en el puerto: ${puerto}`);
})
