//simular o back pra testar as telas
const categorias = [
    {
        nome: 'Comunitário',
        campanhas: [
            { nome: 'Mi de comida!', descricao: 'Descrição sobre o evento', img: 'https://via.placeholder.com/250x150' },
            { nome: 'Feira Solidária', descricao: 'Ajude com doações!', img: 'https://via.placeholder.com/250x150' }
        ]
    },
    {
        nome: 'Animais',
        campanhas: [
            { nome: 'Passeata do Dog!', descricao: 'Venha com seu pet!', img: 'https://via.placeholder.com/250x150' }
        ]
    }
];

const seguidas = ['Campanha X', 'Campanha Y'];
const proximas = ['Campanha Z', 'Campanha W'];

//codigo real 
const main = document.querySelector('main');
const campanhasSeguidas = document.getElementById('campanhas-seguidas');
const campanhasProximas = document.getElementById('campanhas-proximas');


categorias.forEach(categoria => {
    const section = document.createElement('section');
    section.className = 'categoria';

    const titulo = document.createElement('h3');
    titulo.textContent = categoria.nome;

    const container = document.createElement('div');
    container.className = 'container-campanha';

    categoria.campanhas.forEach(campanha => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div class="imagem">
                <img src="${campanha.img}" alt="${campanha.nome}">
            </div>
            <div class="infos">
                <h3>${campanha.nome}</h3>
                <p>${campanha.descricao}</p>
                <div class="acoes">
                    <button class="icon-btn">
                        <img src="../assets/fi-rr-heart.png" alt="curtir">
                    </button>
                    <button class="icon-btn">
                        <img src="../assets/fi-rr-comment.png" alt="comentar">
                    </button>
                    <button class="seguir">Seguir</button>
                    <button class="icon-btn">
                        <img src="../assets/fi-rr-share.png" alt="compartilhar">
                    </button>
                </div>
            </div>
        `
        container.appendChild(card);
    });

    section.appendChild(titulo);
    section.appendChild(container);

    main.appendChild(section);
});

seguidas.forEach(seguida => {
    const li = document.createElement('li');
    li.textContent = seguida;
    campanhasSeguidas.appendChild(li);
});

proximas.forEach(proxima => {
    const li = document.createElement('li');
    li.textContent = proxima;
    campanhasProximas.appendChild(li);
})