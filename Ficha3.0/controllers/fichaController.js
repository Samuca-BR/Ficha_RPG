const db = require('../DDB/database');

exports.salvarFicha = (req, res) => {
    const {
        nome, classe, vida_total, vida_atual, xp, forca, destreza, constituicao,
        inteligencia, sabedoria, carisma, ca, pericias, talentosMagias
    } = req.body;

    const userId = req.session.userId;

    const sqlFicha = `
        INSERT INTO ficha (nome, classe, vida_total, vida_atual, xp, forca, destreza, 
        constituicao, inteligencia, sabedoria, carisma, ca, usuario_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlFicha, [
        nome, classe, vida_total, vida_atual, xp, forca, destreza, constituicao, 
        inteligencia, sabedoria, carisma, ca, userId
    ], (err, result) => {
        if (err) {
            console.error('Erro ao salvar ficha:', err);
            return res.status(500).json({ success: false, error: 'Erro ao salvar ficha.' });
        }

        const fichaId = result.insertId;

        const sqlPericias = `
            INSERT INTO tabelapericias 
            (nome, possui, bonus, treino, total, anotacao, ficha_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        if (Array.isArray(pericias)) {
            pericias.forEach(pericia => {
                db.query(sqlPericias, [
                    pericia.nome, pericia.possui, pericia.bonus, pericia.treino,
                    pericia.total, pericia.anotacao, fichaId
                ], (err) => {
                    if (err) console.error('Erro ao salvar perícia:', err);
                });
            });
        }

        const sqlTalentosMagias = `
            INSERT INTO talentosmagias (descricao, ficha_id) VALUES (?, ?)
        `;
        db.query(sqlTalentosMagias, [talentosMagias, fichaId], (err) => {
            if (err) {
                console.error('Erro ao salvar talentos/magias:', err);
                return res.status(500).json({ success: false, error: 'Erro ao salvar talentos/magias.' });
            }
            res.json({ success: true });
        });
    });
};

exports.carregarFicha = (req, res) => {
    const fichaId = req.params.fichaId;
    const userId = req.session.userId;

    const sql = 'SELECT * FROM ficha WHERE id = ? AND usuario_id = ?';
    db.query(sql, [fichaId, userId], (err, result) => {
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
};
