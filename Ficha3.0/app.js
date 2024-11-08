const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const ejs = require('ejs');
const app = express();

// Configurações do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Altere para o seu usuário do MySQL
    password: 'aluno01', // Altere para a sua senha do MySQL
    database: 'RPG' // Altere para o seu banco de dados
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados');
});

// Configurações do EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'seu_segredo', // Altere para um segredo forte
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
    const senha_hash = require('crypto').createHash('sha256').update(senha).digest('hex'); // Hash da senha

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
    const senha_hash = require('crypto').createHash('sha256').update(senha).digest('hex'); // Hash da senha

    const sql = 'SELECT * FROM usuario WHERE nome_usuario = ? AND senha_hash = ?';
    db.query(sql, [nome_usuario, senha_hash], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao fazer login');
        }
        console.log('Resultado da consulta:', result); // Adicione este log
        if (result.length > 0) {
            req.session.userId = result[0].id; // Certifique-se de que está pegando o ID correto
            return res.redirect('/perfil'); // Redireciona para a página de perfil após o login
        }
        res.send('Usuário ou senha incorretos');
    });
});


// Rota para exibir a página inicial
app.get('/', (req, res) => {
    res.render('index'); // Renderiza a página inicial
});

// Rota para exibir a página da ficha
app.get('/ficha', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para o login se não estiver autenticado
    }
    res.render('ficha'); // Renderiza a ficha
});

// Rota para exibir o perfil do usuário
app.get('/perfil', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para o login se o usuário não estiver autenticado
    }

    const sql = 'SELECT * FROM ficha WHERE usuario_id = ?'; // Consulta para obter as fichas do usuário
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar fichas');
        }
        
        res.render('perfil', { fichas: results }); // Envia as fichas para a página de perfil
    });
});

// Rota para exibir uma ficha específica
app.get('/ficha/:fichaId', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para o login se não estiver autenticado
    }

    const fichaId = req.params.fichaId;
    const sql = 'SELECT * FROM ficha WHERE id = ? AND usuario_id = ?'; // Usar "id" em vez de "ficha_id"
    
    db.query(sql, [fichaId, req.session.userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar ficha');
        }
        
        if (result.length > 0) {
            res.render('ficha', { ficha: result[0] }); // Renderiza a página da ficha com os dados da ficha
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
        res.redirect('/'); // Redireciona para a página de login após o logout
    });
});



// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});