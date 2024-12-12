const mysql = require('mysql'); // Importa o módulo mysql

// Configurações da conexão com o banco de dados
const db = mysql.createPool({
    host: 'localhost',    // Endereço do servidor MySQL
    user: 'root',         // Usuário do MySQL
    password: 'aluno01',  // Senha do MySQL
    database: 'RPG',      // Nome do banco de dados
    connectionLimit: 10,  // Número máximo de conexões no pool
    multipleStatements: true // Permite múltiplas queries na mesma execução (se necessário)
});

// Testa a conexão ao criar o pool
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.code, err.message);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        connection.release(); // Libera a conexão de volta para o pool
    }
});

// Exporta o pool para ser usado em outros arquivos
module.exports = db;
