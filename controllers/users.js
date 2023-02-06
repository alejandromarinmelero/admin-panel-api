const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

// Controladores
const createUser = (req, res) => {

    let params = req.body

    Users.find({
        $or: [
            { username: params.username },
            { email: params.email }
        ]
    }).exec(async (error, user) => {
        if (error) {
            res.status(400).send({
                status: 'error',
                message: 'Error en la conexión'
            })
        }

        // Validar datos requeridos para la creación del usuario
        if(!params.name || !params.username || !params.email || !params.password) {
            res.status(400).send({
                status: 'error',
                code: '01',
                message: 'Debes introducir los datos obligatorios'
            })
        } else if (user && user.length >= 1) {
            res.status(500).send({
                status: 'error',
                code: '02',
                message: 'El usuario ya existe',
                user: user
            })

        } else {

            //Cifrar Contraseña
            let pwd = await bcrypt.hash(params.password, 10);
            params.password = pwd

            let newUser = new Users(params);

            newUser.save((error, savedUser) => {
                if (error || !savedUser) {
                    res.status(400).send({
                        status: 'error',
                        message: 'No se ha podido crear el usuario'
                    })
                }

                res.status(200).send({
                    status: 'success',
                    message: 'el usuario se creó correctamente',
                    savedUser
                });
            });
        }


    });
}

const listUsers = (req, res) => {

    Users.find({}).exec((error, users) => {

        if (error || !users) {
            res.status(400).json({
                status: error,
                message: 'No se pudo realizar la petición'
            })
        }

        res.status(200).json({
            users
        })
    })

}

const loginUsers = (req, res) => {

    let params = req.body

    Users.findOne({
        $and: [
            { email: params.email },
            { username: params.username },
        ]
    })
        .exec((error, user) => {
            if (error) {
                res.status(400).json({
                    status: 'error',
                    code: '001',
                    message: 'no se ha podido realizar la petición'
                })
            } else if (!user) {
                res.status(400).json({
                    status: 'error',
                    code: '002',
                    message: 'El usuario no existe'
                })
            } else {

                //Generar Token
                let token = jwt.createToken(user);

                //Comprobar autenticidad de la contraseña
                let pwd = bcrypt.compareSync(params.password, user.password)

                //Añadir fecha y hora de login

                !pwd ? res.status(400).json({
                    status: 'error',
                    code: '003',
                    message: 'La contraseña es incorrecta'
                }) :
                    res.status(200).json({
                        status: 'success',
                        user: {
                            user,
                            token
                        }
                    })
            }

        })

}

const profile = (req, res) => {

    let id = req.params.id

    Users.findById(id).exec((error, authenticatedUser) => {
        if (error || !authenticatedUser) {
            res.status(400).send({
                status: 'no se ha podido realizar la petición'
            })
        } else {
            res.status(200).json({
                status: 'success',
                authenticatedUser
            })
        }

    })
}

const editUsers = (req, res) => {

    let parametros = req.body
    let id = req.params.id

    Users.findById(id).exec(async (error, foundUser) => {
        if (error || !foundUser) {
            res.status(400).send({
                status: 'no se ha podido realizar la petición'
            })
        }

        let pwd = bcrypt.compareSync(parametros.password, foundUser.password)

        // Cifrar nueva Contraseña
        if (!pwd) {
            if (parametros.password === '') {
                parametros.password = foundUser.password;
            } else {
                let newPassword = await bcrypt.hash(parametros.password, 10);
                parametros.password = newPassword
            }
        } else {
            parametros.password = foundUser.password;
        }

        Users.findByIdAndUpdate(id, parametros).exec(async (error, updatedUser) => {
            if (error || !updatedUser) {
                res.status(400).send({
                    status: 'no se ha podido realizar la petición'
                })
            }

            res.status(200).json({
                status: 'success',
                updatedUser,
                password: pwd,
                parametros: parametros
            })

        })
    })
}

const deleteUsers = (req, res) => {

    let id = req.params.id;
    let parameters = req.body;

    Users.findById(id).exec((error, userToRemove) => {
        if (error || !userToRemove) {
            res.status(400).send({
                status: 'no se ha podido realizar la petición'
            })
        } else {

            let pwd = bcrypt.compareSync(parameters.password, userToRemove.password)

            if (!pwd) {
                res.status(400).send({
                    status: 'error',
                    message: 'La contraseña no coicide'
                })
            } else {

                Users.findOneAndDelete({ _id: userToRemove._id }).exec((error, removedUser) => {
                    if (error || !removedUser) {
                        res.status(400).send({
                            status: ' error',
                            message: 'no se ha podido realizar la petición'
                        })
                    } else {
                        res.status(200).json({
                            status: 'success',
                            removedUser: removedUser
                        })
                    }
                })
            }
        }


    })

}

module.exports = {
    createUser,
    listUsers,
    loginUsers,
    profile,
    editUsers,
    deleteUsers,
}