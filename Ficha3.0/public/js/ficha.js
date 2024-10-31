// Função para calcular o modificador de atributos
function calcularModificador(atributo) {
    return Math.floor((atributo - 10) / 2);
}

// Função para atualizar o display do modificador
function atualizarModificador(atributoId, modificadorId) {
    const atributo = parseInt(document.getElementById(atributoId).value) || 0;
    const modificador = calcularModificador(atributo);
    document.getElementById(modificadorId).textContent = "Mod: " + modificador;
    return modificador; // Retorna o modificador para uso em outros códigos
}

// Função para atualizar todos os modificadores e a CA
function atualizarModificadores() {
    const modificadorDestreza = atualizarModificador('destreza', 'modificadorDestreza');
    atualizarModificador('forca', 'modificadorForca');
    atualizarModificador('constituição', 'modificadorConstituicao');
    atualizarModificador('inteligencia', 'modificadorInteligencia');
    atualizarModificador('sabedoria', 'modificadorSabedoria');
    atualizarModificador('carisma', 'modificadorCarisma');

    // Atualiza a Classe de Armadura
    calcularCA();
}

// Função para calcular a CA
function calcularCA() {
    const nivel = parseInt(document.getElementById('nivel').textContent.replace('Nível: ', '')) || 1; // Obtém o nível
    const caBase = 10; // CA base
    const modificadorDestreza = parseInt(document.getElementById('modificadorDestreza').textContent.replace('Mod: ', '')) || 0; // Obtém o modificador de Destreza
    const metadeNivel = Math.floor(nivel / 2); // Calcula metade do nível
    const ca = caBase + modificadorDestreza + metadeNivel; // Calcula a CA com o modificador de Destreza e metade do nível
    document.getElementById("ca").textContent = ca; // Atualiza o display da CA
}

// Função para obter os atributos para as perícias
function obterModificadorAtributo(atributo) {
    const atributoId = {
        inteligencia: 'inteligencia',
        sabedoria: 'sabedoria',
        destreza: 'destreza',
        forca: 'forca',
        carisma: 'carisma'
    }[atributo];
    
    return calcularModificador(parseInt(document.getElementById(atributoId).value) || 0);
}

// Função para atualizar o total da perícia
function atualizarTotal(pericia) {
    const possui = document.getElementById(`possui-${pericia}`).checked;
    const bonus = parseInt(document.getElementById(`bonus-${pericia}`).value) || 0;
    const treino = document.getElementById(`treino-${pericia}`).checked;
    
    let atributo = 0;
    switch (pericia) {
        case 'acrobacia':
        case 'cavalgar':
        case 'furtividade':
        case 'iniciativa':
        case 'ladinagem':
            atributo = parseInt(document.getElementById('destreza').value) || 0;
            break;
        case 'atletismo':
            atributo = parseInt(document.getElementById('forca').value) || 0;
            break;
        case 'magia':
        case 'oficio':
        case 'conhecimento':
            atributo = parseInt(document.getElementById('inteligencia').value) || 0;
            break;
        case 'cura':
        case 'intuicao':
        case 'percepcao':
        case 'sobrevivencia':
            atributo = parseInt(document.getElementById('sabedoria').value) || 0;
            break;
        case 'animais':
        case 'atuacao':
        case 'diplomacia':
        case 'engancacao':
        case 'intimidacao':
        case 'informacao':
            atributo = parseInt(document.getElementById('carisma').value) || 0;
            break;
    }
    
    const modificadorAtributo = Math.floor((atributo - 10) / 2);
    const total = (possui ? modificadorAtributo : 0) + bonus + (treino ? 2 : 0);

    document.getElementById(`total-${pericia}`).textContent = total;
}

// Inicializar todos os campos de total
const pericias = [
    'acrobacia', 'animais', 'atletismo', 'cavalgar', 'conhecimento', 'cura', 'diplomacia', 
    'engancacao', 'furtividade', 'magia', 'iniciativa', 'intimidacao', 'intuicao', 'jogatina', 
    'ladinagem', 'informacao', 'oficio', 'percepcao', 'sobrevivencia'
];

pericias.forEach(pericia => atualizarTotal(pericia));

// Função para calcular o nível
function calcularNivel() {
    const xp = parseInt(document.getElementById("xp").value);
    let nivel = 1;

    // Mapeia faixas de XP para níveis
    if (xp >= 0 && xp < 1000) {
        nivel = 1;
    } else if (xp >= 1000 && xp < 3000) {
        nivel = 2;
    } else if (xp >= 3000 && xp < 6000) {
        nivel = 3;
    } else if (xp >= 6000 && xp < 10000) {
        nivel = 4;
    } else if (xp >= 10000 && xp < 15000) {
        nivel = 5;
    } else if (xp >= 15000 && xp < 21000) {
        nivel = 6;
    } else if (xp >= 21000 && xp < 28000) {
        nivel = 7;
    } else if (xp >= 28000 && xp < 36000) {
        nivel = 8;
    } else if (xp >= 36000 && xp < 45000) {
        nivel = 9;
    } else if (xp >= 45000 && xp < 55000) {
        nivel = 10;
    } else if (xp >= 55000 && xp < 66000) {
        nivel = 11;
    } else if (xp >= 66000 && xp < 78000) {
        nivel = 12;
    } else if (xp >= 78000 && xp < 91000) {
        nivel = 13;
    } else if (xp >= 91000 && xp < 105000) {
        nivel = 14;
    } else if (xp >= 105000 && xp < 120000) {
        nivel = 15;
    } else if (xp >= 120000 && xp < 136000) {
        nivel = 16;
    } else if (xp >= 136000 && xp < 153000) {
        nivel = 17;
    } else if (xp >= 153000 && xp < 171000) {
        nivel = 18;
    } else if (xp >= 171000 && xp < 190000) {
        nivel = 19;
    } else if (xp >= 190000 && xp <= 210000) {
        nivel = 20;
    }

    // Atualiza o nível calculado na página
    document.getElementById("nivel").textContent = "Nível: " + nivel;
    calcularCA(); // Recalcula a CA ao atualizar o nível
}
