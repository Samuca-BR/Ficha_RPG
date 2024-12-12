const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.post('/login', authController.login);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
