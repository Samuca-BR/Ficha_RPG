const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const ejs = require('ejs');
const app = express();

// Configurações do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aluno01',
    database: 'RPG'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Configurações do EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'seu_segredo',
    resave: false,
    saveUninitialized: true,
}));

// Rota para exibir a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para exibir a página de cadastro
app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// Rota para processar o cadastro
app.post('/cadastro', (req, res) => {
    const { nome_usuario, senha } = req.body;
    const senha_hash = require('crypto').createHash('sha256').update(senha).digest('hex');

    const sql = 'INSERT INTO usuario (nome_usuario, senha_hash) VALUES (?, ?)';
    db.query(sql, [nome_usuario, senha_hash], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao cadastrar usuário');
        }
        res.redirect('/login');
    });
});

// Rota para processar o login
app.post('/login', (req, res) => {
    const { nome_usuario, senha } = req.body;
    const senha_hash = require('crypto').createHash('sha256').update(senha).digest('hex');

    const sql = 'SELECT * FROM usuario WHERE nome_usuario = ? AND senha_hash = ?';
    db.query(sql, [nome_usuario, senha_hash], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao fazer login');
        }
        if (results.length > 0) {
            req.session.userId = results[0].id;
            return res.redirect('/perfil');
        } else {
            res.send('Usuário ou senha incorretos');
        }
    });
});

// Rota inicial que redireciona para o perfil, se logado
app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/perfil');
    }
    res.render('index');
});

// Rota para exibir o perfil do usuário e suas fichas
app.get('/perfil', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const sql = 'SELECT * FROM ficha WHERE usuario_id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar fichas');
        }
        
        res.render('perfil', { fichas: results });
    });
});

// Rota para exibir uma ficha específica com suas perícias e talentos/magias
app.get('/ficha/:fichaId', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const fichaId = req.params.fichaId;
    const fichaQuery = 'SELECT * FROM ficha WHERE id = ? AND usuario_id = ?';
    const periciaQuery = 'SELECT * FROM pericia WHERE ficha_id = ?';
    const talentosMagiasQuery = 'SELECT * FROM talentos_magias WHERE ficha_id = ?';

    db.query(fichaQuery, [fichaId, req.session.userId], (err, fichaResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar ficha');
        }
        
        if (fichaResults.length > 0) {
            db.query(periciaQuery, [fichaId], (err, periciaResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao buscar perícias');
                }

                db.query(talentosMagiasQuery, [fichaId], (err, talentosMagiasResults) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erro ao buscar talentos e magias');
                    }

                    res.render('ficha', {
                        ficha: fichaResults[0],
                        pericias: periciaResults,
                        talentosMagias: talentosMagiasResults
                    });
                });
            });
        } else {
            res.status(404).send('Ficha não encontrada');
        }
    });
});

// Rota para logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao encerrar a sessão:', err);
            return res.status(500).send('Erro ao fazer logout');
        }
        res.redirect('/login');
    });
});

app.post('/ficha/salvar', (req, res) => {
    // Verifica se o usuário está autenticado
    if (!req.session.userId) {
        return res.status(403).send('Usuário não autenticado');
    }

    // Extrai os dados da ficha enviados pelo formulário
    const { nome, classe, vida_total, vida_atual, xp, forca, destreza, constituicao, inteligencia, sabedoria, carisma, ca } = req.body;

    // Consulta SQL para inserir uma nova ficha na tabela
    const sql = `
        INSERT INTO ficha (nome, classe, vida_total, vida_atual, xp, forca, destreza, constituicao, inteligencia, sabedoria, carisma, ca, usuario_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nome, classe, vida_total, vida_atual, xp, forca, destreza, constituicao, inteligencia, sabedoria, carisma, ca, req.session.userId];

    // Executa a query para salvar a ficha no banco
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao salvar ficha');
        }
        // Redireciona para a página de perfil do usuário após salvar a ficha
        res.redirect('/perfil');
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
