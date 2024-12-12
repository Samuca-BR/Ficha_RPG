const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();

router.post('/cadastro', usuarioController.cadastrarUsuario);

module.exports = router;
