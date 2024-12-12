const db = require('./DDB/database');

db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
        process.exit(1); // Sai do processo com erro
    }
    console.log('Banco conectado! Teste bem-sucedido:', results[0].solution);
    process.exit(0); // Sai do processo com sucesso
});
