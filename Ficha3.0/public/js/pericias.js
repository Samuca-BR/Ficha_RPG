

// Função para salvar todas as perícias do personagem
function salvarTodasPericias(personagemId) {
    const pericias = [
        { nome: 'acrobacia', bonus: parseInt(document.getElementById('bonus-acrobacia').value) || 0, anotacao: document.getElementById('anotacao-acrobacia').value || '' },
        { nome: 'cavalgar', bonus: parseInt(document.getElementById('bonus-cavalgar').value) || 0, anotacao: document.getElementById('anotacao-cavalgar').value || '' },
        { nome: 'furtividade', bonus: parseInt(document.getElementById('bonus-furtividade').value) || 0, anotacao: document.getElementById('anotacao-furtividade').value || '' },
        { nome: 'iniciativa', bonus: parseInt(document.getElementById('bonus-iniciativa').value) || 0, anotacao: document.getElementById('anotacao-iniciativo').value || '' },
        { nome: 'ladinagem', bonus: parseInt(document.getElementById('bonus-ladinagem').value) || 0, anotacao: document.getElementById('anotacao-ladinagem').value || '' },
        { nome: 'atletismo', bonus: parseInt(document.getElementById('bonus-atletismo').value) || 0, anotacao: document.getElementById('anotacao-atletismo').value || '' },
        { nome: 'magia', bonus: parseInt(document.getElementById('bonus-magia').value) || 0, anotacao: document.getElementById('anotacao-magia').value || '' },
        { nome: 'oficio', bonus: parseInt(document.getElementById('bonus-oficio').value) || 0, anotacao: document.getElementById('anotacao-oficio').value || '' },
        { nome: 'conhecimento', bonus: parseInt(document.getElementById('bonus-conhecimento').value) || 0, anotacao: document.getElementById('anotacao-conhecimento').value || '' },
        { nome: 'cura', bonus: parseInt(document.getElementById('bonus-cura').value) || 0, anotacao: document.getElementById('anotacao-cura').value || '' },
        { nome: 'intuicao', bonus: parseInt(document.getElementById('bonus-intuicao').value) || 0, anotacao: document.getElementById('anotacao-intuicao').value || '' },
        { nome: 'percepcao', bonus: parseInt(document.getElementById('bonus-percepcao').value) || 0, anotacao: document.getElementById('anotacao-percepcao').value || '' },
        { nome: 'sobrevivencia', bonus: parseInt(document.getElementById('bonus-sobrevivencia').value) || 0, anotacao: document.getElementById('anotacao-sobrevivencia').value || '' },
        { nome: 'animais', bonus: parseInt(document.getElementById('bonus-animais').value) || 0, anotacao: document.getElementById('anotacao-animais').value || '' },
        { nome: 'atuacao', bonus: parseInt(document.getElementById('bonus-atuacao').value) || 0, anotacao: document.getElementById('anotacao-ataucao').value || '' },
        { nome: 'diplomacia', bonus: parseInt(document.getElementById('bonus-diplomacia').value) || 0, anotacao: document.getElementById('anotacao-diplomacia').value || '' },
        { nome: 'enganacao', bonus: parseInt(document.getElementById('bonus-enganacao').value) || 0, anotacao: document.getElementById('anotacao-enganacao').value || '' },
        { nome: 'intimidacao', bonus: parseInt(document.getElementById('bonus-intimidacao').value) || 0, anotacao: document.getElementById('anotacao-intimidacao').value || '' },
        { nome: 'informacao', bonus: parseInt(document.getElementById('bonus-informacao').value) || 0, anotacao: document.getElementById('anotacao-informacao').value || '' },
        // Adicione outras perícias aqui da mesma forma
    ];

    pericias.forEach(pericia => {
        salvarPericia(pericia.nome, pericia.bonus, pericia.anotacao, personagemId);
    });
}