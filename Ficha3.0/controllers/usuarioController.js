const db = require('../DDB/database');
const crypto = require('crypto');

exports.cadastrarUsuario = (req, res) => {
    const { nome_usuario, senha } = req.body;
    const senha_hash = crypto.createHash('sha256').update(senha).digest('hex');

    const sql = 'INSERT INTO usuario (nome_usuario, senha_hash) VALUES (?, ?)';
    db.query(sql, [nome_usuario, senha_hash], (err) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).send('Erro ao cadastrar usuário');
        }
        res.redirect('/login');
    });
};
