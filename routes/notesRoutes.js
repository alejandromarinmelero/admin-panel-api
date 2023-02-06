const express = require('express');
const router = express.Router();
const { listNotes, createNotes, deleteNotes, deleteAllNotes, editNotes } = require('../controllers/notes');

router.get('/listar-notas/:id', listNotes);
router.put('/crear-notas/:id', createNotes);
router.put('/editar-notas/:id', editNotes);
router.put('/eliminar-una-nota/:id', deleteNotes);
router.put('/eliminar-notas/:id', deleteAllNotes);

module.exports = router