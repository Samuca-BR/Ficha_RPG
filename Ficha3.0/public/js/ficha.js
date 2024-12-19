// Função para calcular o modificador de atributos
function calcularModificador(atributo) {
    return Math.floor((atributo - 10) / 2);
}

// Função para atualizar o display do modificador
function atualizarModificador(atributoId, modificadorId) {
    const atributo = parseInt(document.getElementById(atributoId).value) || 0;
    const modificador = calcularModificador(atributo);
    document.getElementById(modificadorId).textContent = "Mod: " + modificador;
    return modificador;
}

// Função para atualizar todos os modificadores e a CA
function atualizarModificadores() {
    const modificadorDestreza = atualizarModificador('destreza', 'modificadorDestreza');
    atualizarModificador('forca', 'modificadorForca');
    atualizarModificador('constituição', 'modificadorConstituicao');
    atualizarModificador('inteligencia', 'modificadorInteligencia');
    atualizarModificador('sabedoria', 'modificadorSabedoria');
    atualizarModificador('carisma', 'modificadorCarisma');
    calcularCA();
}

// Função para calcular a CA
function calcularCA() {
    const nivel = parseInt(document.getElementById('nivel').textContent.replace('Nível: ', '')) || 1;
    const caBase = 10;
    const modificadorDestreza = parseInt(document.getElementById('modificadorDestreza').textContent.replace('Mod: ', '')) || 0;
    const metadeNivel = Math.floor(nivel / 2);
    const ca = caBase + modificadorDestreza + metadeNivel;
    document.getElementById("ca").textContent = ca;
}

// Função para calcular o nível com base na experiência (XP)
function calcularNivel() {
    const xp = parseInt(document.getElementById("xp").value);
    let nivel = 1;

    if (xp >= 0 && xp < 1000) nivel = 1;
    else if (xp >= 1000 && xp < 3000) nivel = 2;
    else if (xp >= 3000 && xp < 6000) nivel = 3;
    else if (xp >= 6000 && xp < 10000) nivel = 4;
    else if (xp >= 10000 && xp < 15000) nivel = 5;
    else if (xp >= 15000 && xp < 21000) nivel = 6;
    else if (xp >= 21000 && xp < 28000) nivel = 7;
    else if (xp >= 28000 && xp < 36000) nivel = 8;
    else if (xp >= 36000 && xp < 45000) nivel = 9;
    else if (xp >= 45000 && xp < 55000) nivel = 10;
    else if (xp >= 55000 && xp < 66000) nivel = 11;
    else if (xp >= 66000 && xp < 78000) nivel = 12;
    else if (xp >= 78000 && xp < 91000) nivel = 13;
    else if (xp >= 91000 && xp < 105000) nivel = 14;
    else if (xp >= 105000 && xp < 120000) nivel = 15;
    else if (xp >= 120000 && xp < 136000) nivel = 16;
    else if (xp >= 136000 && xp < 153000) nivel = 17;
    else if (xp >= 153000 && xp < 171000) nivel = 18;
    else if (xp >= 171000 && xp < 190000) nivel = 19;
    else if (xp >= 190000 && xp <= 210000) nivel = 20;

    document.getElementById("nivel").textContent = "Nível: " + nivel;
    calcularCA();
    return nivel;
}

// Função para calcular bt e bb com base no nível
function calcularBonusPericia(nivel) {
    let bt = 0;
    let bb = 0;

    switch (nivel) {
        case 1:  bt = 2; bb = 0; break;
        case 2:  bt = 3; bb = 1; break;
        case 3:  bt = 3; bb = 1; break;
        case 4:  bt = 4; bb = 2; break;
        case 5:  bt = 4; bb = 2; break;
        case 6:  bt = 5; bb = 3; break;
        case 7:  bt = 7; bb = 3; break;
        case 8:  bt = 8; bb = 4; break;
        case 9:  bt = 9; bb = 4; break;
        case 10: bt = 10; bb = 5; break;
        case 11: bt = 11; bb = 5; break;
        case 12: bt = 12; bb = 6; break;
        case 13: bt = 13; bb = 6; break;
        case 14: bt = 14; bb = 7; break;
        case 15: bt = 15; bb = 7; break;
        case 16: bt = 16; bb = 8; break;
        case 17: bt = 17; bb = 8; break;
        case 18: bt = 18; bb = 9; break;
        case 19: bt = 19; bb = 9; break;
        case 20: bt = 20; bb = 10; break;
        default: bt = 0; bb = 0; break;
    }
    return { bt, bb };
}

// Função para atualizar o total da perícia
function atualizarTotal(pericia) {
    const possui = document.getElementById(`possui-${pericia}`).checked;
    const bonus = parseInt(document.getElementById(`bonus-${pericia}`).value) || 0;
    const treino = document.getElementById(`treino-${pericia}`).checked;
    const nivel = calcularNivel();
    const { bt, bb } = calcularBonusPericia(nivel);

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

    const modificadorAtributo = calcularModificador(atributo);
    const total = possui ? (modificadorAtributo + bonus + (treino ? bt : bb)) : 0;

    document.getElementById(`total-${pericia}`).textContent = total;
}

document.addEventListener('DOMContentLoaded', () => {
    pericias.forEach(pericia => atualizarTotal(pericia));
});

// Inicializar todos os campos de total
const pericias = [
    'acrobacia', 'animais', 'atletismo', 'cavalgar', 'conhecimento', 'cura', 'diplomacia', 
    'engancacao', 'furtividade', 'magia', 'iniciativa', 'intimidacao', 'intuicao', 'jogatina', 
    'ladinagem', 'informacao', 'oficio', 'percepcao', 'sobrevivencia'
];

pericias.forEach(pericia => atualizarTotal(pericia));
