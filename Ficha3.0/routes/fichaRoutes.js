const express = require('express');
const router = express.Router();
const fichaController = require('../controllers/fichaController');

// Rota para salvar a ficha
router.post('/salvar', fichaController.salvarFicha);

// Rota para carregar uma ficha (exemplo adicional)
router.get('/:id', fichaController.carregarFicha);

module.exports = router;
