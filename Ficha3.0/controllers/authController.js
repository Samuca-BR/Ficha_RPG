const db = require('../DDB/database');
const crypto = require('crypto');

exports.login = (req, res) => {
    const { nome_usuario, senha } = req.body;
    const senha_hash = crypto.createHash('sha256').update(senha).digest('hex');

    const sql = 'SELECT * FROM usuario WHERE nome_usuario = ? AND senha_hash = ?';
    db.query(sql, [nome_usuario, senha_hash], (err, result) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            return res.status(500).send('Erro ao fazer login');
        }
        if (result.length > 0) {
            req.session.userId = result[0].id;
            return res.redirect('/perfil');
        }
        res.send('Usuário ou senha incorretos');
    });
};
