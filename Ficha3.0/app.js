const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();

// Configurações do EJS e Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Configurando a pasta para views
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Para suporte ao formato JSON no corpo das requisições
app.use(express.static(path.join(__dirname, 'public'))); // Configurando a pasta de arquivos estáticos

app.use(
    session({
        secret: 'seu_segredo', // Alterar para um segredo forte e único
        resave: false,
        saveUninitialized: false, // Mantém a sessão não inicializada até que seja modificada
    })
);

// Rotas
const fichaRoutes = require('./routes/fichaRoutes'); // Rotas relacionadas às fichas
const usuarioRoutes = require('./routes/usuarioRoutes'); // Rotas relacionadas a usuários
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação

// Configuração das rotas
app.use('/ficha', fichaRoutes); // Exemplo: /ficha/salvar, /ficha/:fichaId
app.use('/usuario', usuarioRoutes); // Exemplo: /usuario/cadastro
app.use('/', authRoutes); // Exemplo: /login, /logout

// Middleware para tratar erros 404 (rota não encontrada)
app.use((req, res) => {
    res.status(404).render('404', { message: 'Página não encontrada' });
});

// Middleware para tratar erros do servidor
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).render('500', { message: 'Erro interno do servidor' });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
