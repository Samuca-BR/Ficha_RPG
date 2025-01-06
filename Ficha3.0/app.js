const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const crypto = require('crypto');
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

// Configurações do EJS e Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'seu_segredo', // Alterar para um segredo forte
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
    const senha_hash = crypto.createHash('sha256').update(senha).digest('hex');

    const sql = 'INSERT INTO usuario (nome_usuario, senha_hash) VALUES (?, ?)';
    db.query(sql, [nome_usuario, senha_hash], (err) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).send('Erro ao cadastrar usuário');
        }
        res.redirect('/login');
    });
});

// Rota para processar o login
app.post('/login', (req, res) => {
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
});

// Rota para exibir a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para exibir a página da ficha
app.get('/ficha', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('ficha');
});

// Rota para exibir o perfil do usuário
app.get('/perfil', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const sql = 'SELECT * FROM ficha WHERE usuario_id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar fichas:', err);
            return res.status(500).send('Erro ao buscar fichas');
        }
        res.render('perfil', { fichas: results });
    });
});

// Rota para salvar ficha
app.post('/salvarFicha', (req, res) => {
    const {
        nome = '',
        classe = '',
        vida_total = 0,
        vida_atual = 0,
        xp = 0,
        forca = 0,
        destreza = 0,
        constituicao = 0,
        inteligencia = 0,
        sabedoria = 0,
        carisma = 0,
        ca = 0,
        pericias = [],
        talentosMagias = []
    } = req.body;

    const userId = req.session.userId;

    if (!userId) {
        return res.status(400).json({ success: false, error: 'Usuário não autenticado.' });
    }

    const sqlFicha = `
        INSERT INTO ficha (nome, classe, vida_total, vida_atual, xp, forca, destreza, 
        constituicao, inteligencia, sabedoria, carisma, ca, usuario_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlFicha, [
        nome, classe, vida_total, vida_atual, xp, forca, destreza,
        constituicao, inteligencia, sabedoria, carisma, ca, userId
    ], (err, result) => {
        if (err) {
            console.error('Erro ao salvar ficha:', err);
            return res.status(500).json({ success: false, error: 'Erro ao salvar ficha.' });
        }

        const fichaId = result.insertId;

        // Salvar perícias
        if (Array.isArray(pericias)) {
            const sqlPericias = `
                INSERT INTO tabelapericias (nome, bonus, anotacao, ficha_id) 
                VALUES (?, ?, ?, ?)
            `;
            pericias.forEach(pericia => {
                const { nome, bonus = 0, anotacao = '' } = pericia;
                db.query(sqlPericias, [nome, bonus, anotacao, fichaId], (err) => {
                    if (err) console.error('Erro ao salvar perícia:', err);
                });
            });
        }

        // Salvar talentos e magias
        if (Array.isArray(talentosMagias)) {
            const sqlTalentosMagias = `
                INSERT INTO talentos_magias (descricao, ficha_id) 
                VALUES (?, ?)
            `;
            talentosMagias.forEach(descricao => {
                db.query(sqlTalentosMagias, [descricao, fichaId], (err) => {
                    if (err) console.error('Erro ao salvar talentos/magias:', err);
                });
            });
        }

        res.json({ success: true, fichaId });
    });
});

// Rota para exibir uma ficha específica
app.get('/ficha/:fichaId', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const fichaId = req.params.fichaId;
    const sql = 'SELECT * FROM ficha WHERE id = ? AND usuario_id = ?';

    db.query(sql, [fichaId, req.session.userId], (err, result) => {
        if (err) {
            console.error('Erro ao buscar ficha:', err);
            return res.status(500).send('Erro ao buscar ficha');
        }
        if (result.length > 0) {
            res.render('ficha', { ficha: result[0] });
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
        res.redirect('/');
    });
});

// Rota para carregar ficha
app.get('/carregarFicha/:id', (req, res) => {
    const fichaId = req.params.id;

    const sql = 'SELECT * FROM ficha WHERE id = ? AND usuario_id = ?';

    db.query(sql, [fichaId, req.session.userId], (err, result) => {
        if (err) {
            console.error('Erro ao carregar ficha:', err);
            return res.json({ success: false, error: err.message });
        }
        if (result.length > 0) {
            res.json({ success: true, ficha: result[0] });
        } else {
            res.json({ success: false, error: 'Ficha não encontrada' });
        }
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
