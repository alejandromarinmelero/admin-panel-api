const express = require('express');
const router = express.Router();
const check = require('../middlewares/auth');
const { createUser, listUsers, loginUsers, profile, editUsers, deleteUsers } = require('../controllers/users');

router.post('/crear-usuario', createUser);
router.get('/listar-usuarios', listUsers);
router.get('/profile/:id', check.auth, profile);
router.post('/login', loginUsers);
router.put('/editar-usuario/:id', editUsers);
router.delete('/eliminar-usuario/:id', deleteUsers);

module.exports = router;