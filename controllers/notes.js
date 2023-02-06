const Users = require('../models/user');
const uuidv4 = require('uuid');


const listNotes = (req, res) => {

    let id = req.params.id;

    Users.findById(id).exec((error, userFound) => {
        if (error || !userFound) {
            res.status(400).json({
                status: error,
                message: 'No se pudo establecer conexión'
            })
        }

        res.status(200).json({
            message: 'success',
            userFoundNotes: userFound.notes
        })
    })

}

const createNotes = (req, res) => {

    let parameters = req.body;
    let id = req.params.id
    
    parameters.id = uuidv4.v4();
    parameters.date = new Date().toLocaleString();
    parameters.modificationDate = new Date().toLocaleString();

    Users.updateOne({_id: id}, {$push:{notes: parameters}}).exec((error, updatedUser) => {
        if (error || !updatedUser) {
            res.status(400).json({
                status: error,
                message: 'No se pudo crear la nota'
            })
        }

        res.status(200).json({
            message: 'success',
            updatedUser,
            parameters: parameters
        })
    })

}


const deleteNotes = (req, res) => {

    let parameters = req.body;
    let id = req.params.id;

    Users.updateOne({_id: id}, {$pull:{notes: {id: parameters.id}}}).exec((error, updatedUser) => {
        if (error || !updatedUser) {
            res.status(400).json({
                status: error,
                message: 'No se pudo crear la nota'
            })
        }

        res.status(200).json({
            message: 'success',
            updatedUser,
            parameters: parameters
        })
    })
}


const deleteAllNotes = (req, res) => {

    let id = req.params.id;

    Users.updateOne({_id: id}, {$set:{notes: []}}).exec((error, updatedUser) => {
        if (error || !updatedUser) {
            res.status(400).json({
                status: error,
                message: 'No se pudo crear la nota'
            })
        }

        res.status(200).json({
            message: 'success',
            updatedUser,
        })
    })
}


const editNotes = (req, res, next) => {

    let id = req.params.id;
    let parameters = req.body;

    Users.updateOne(
        {$and: [
            {_id: id},
            {'notes.id': parameters.id}
        ]},
        {$set: {
            'notes.$.title': parameters.title,
            'notes.$.note': parameters.note,
            'notes.$.modificationDate': new Date().toLocaleString()
        }},
        ).exec((error, updatedUser) => {
        if (error || !updatedUser) {
            res.status(400).json({
                status: error,
                message: 'No se pudo crear la nota'
            })
        } else {
            res.status(200).json({
                message: 'success',
                updatedUser,
                parameters: parameters
            })
        }

        
    })

}

module.exports = {
    listNotes,
    createNotes,
    editNotes,
    deleteNotes,
    deleteAllNotes,
}