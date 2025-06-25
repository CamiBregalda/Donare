const main = document.querySelector('main');
const campanhasSeguidasLista = document.getElementById('campanhas-seguidas');
const campanhasProximasLista = document.getElementById('campanhas-proximas');

function getImageUrl(imagemCapaBase64) {
    if (imagemCapaBase64) {
        return `data:image/jpeg;base64,${imagemCapaBase64}`;
    }
    return 'https://via.placeholder.com/250x150?text=Sem+Imagem';
}

function criarItemListaLateral(campanha) {
    const li = document.createElement('li');
    li.textContent = campanha.titulo;
    return li;
}

function criarCardCampanha(campanha) {
    const imageUrl = getImageUrl(campanha.imagemCapa);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="imagem">
            <img src="${imageUrl}" alt="${campanha.titulo}">
        </div>
        <div class="infos">
            <h3>${campanha.titulo}</h3>
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
        </div>`;
    return card;
}

async function renderizaCampanhas() {

    try {
        const response = await fetch('http://localhost:8080/campanhas');
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const todasCampanhas = await response.json();

        console.log('Dados da API (todasCampanhas):', todasCampanhas);

        main.innerHTML = '';
        campanhasSeguidasLista.innerHTML = '';
        campanhasProximasLista.innerHTML = '';

        const campanhasAtivas = todasCampanhas.filter(c => c.status && c.status.toUpperCase() === 'ATIVA');

        const hoje = new Date();
        const campanhasProximas = todasCampanhas.filter(c => c.dt_inicio && new Date(c.dt_inicio) > hoje);

        if (campanhasAtivas.length > 0) {
            campanhasAtivas.forEach(campanha => {
                campanhasSeguidasLista.appendChild(criarItemListaLateral(campanha));
            });
        } else {
            campanhasSeguidasLista.innerHTML = '<li>Nenhuma campanha seguida no momento.</li>';
        }

        if (campanhasProximas.length > 0) {
            campanhasProximas.forEach(campanha => {
                campanhasProximasLista.appendChild(criarItemListaLateral(campanha));
            });
        } else {
            campanhasProximasLista.innerHTML = '<li>Nenhuma campanha próxima no momento.</li>';
        }

        const categoriasCampanhas = todasCampanhas.reduce((acc, campanha) => {
            const categoria = campanha.categoriaCampanha || 'Outros';
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(campanha);
            return acc;
        }, {});

        Object.keys(categoriasCampanhas).forEach(nomeCategoria => {
            const section = document.createElement('section');
            section.className = 'categoria';

            const titulo = document.createElement('h3');
            titulo.textContent = nomeCategoria;

            const container = document.createElement('div');
            container.className = 'container-campanha';

            categoriasCampanhas[nomeCategoria].forEach(campanha => {
                container.appendChild(criarCardCampanha(campanha));
            });

            section.appendChild(titulo);
            section.appendChild(container);
            main.appendChild(section);
        });

    } catch (error){
        console.error('Erro ao buscar campanhas:', error);
        main.innerHTML= '<p>Não foi possível carregar as campanhas.</p>';
        campanhasSeguidasLista.innerHTML = '<li>Erro ao carregar</li>';
        campanhasProximasLista.innerHTML = '<li>Erro ao carregar</li>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizaCampanhas();
});