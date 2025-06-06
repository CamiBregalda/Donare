//Ainda não testei, preciso rodar o backend
const main = document.querySelector('main');
const campanhasSeguidasLista = document.getElementById('campanhas-seguidas');
const campanhasProximasLista = document.getElementById('campanhas-proximas');


function getImageUrl(imagemCapaBase64) {
    if (imagemCapaBase64) {
        return `data:image/jpeg;base64,${imagemCapaBase64}`; // Adapte o tipo MIME (jpeg, png, etc.)
    }
    return 'https://via.placeholder.com/250x150?text=Sem+Imagem'; // Fallback
}

// Se o backend ENVIAR a imagem através de um endpoint separado (que é mais comum e performático para imagens grandes):
/*function getImageUrl(campanhaId) {
   return `http://localhost:8080/campanhas/${campanhaId}/imagem`;
}*/

async function renderizaCampanhas(params) {

    try {

        const response = await fetch('http://localhost:8080/campanhas');
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const campanhasExistentes = await response.json();

        main.innerHTML = '';
        campanhasSeguidasLista.innerHTML = '';
        campanhasProximasLista.innerHTML = '';

        const categoriasCampanhas = campanhasExistentes.reduce((acc, campanha) => {
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
            titulo.textContent = categoria.nome;

            const container = document.createElement('div');
            container.className = 'container-campanha';

            categoriasCampanhas[nomeCategoria].forEach(campanha => {
                const card = document.createElement('div');
                card.className = 'card';

                const imageUrl = getImageUrl(campanha.imagemCapa);

                card.innerHTML = `
            <div class="imagem">
                <img src="${getImageUrl}" alt="${campanha.titulo}">
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
            </div>
        `
                container.appendChild(card);
            });

            section.appendChild(titulo);
            section.appendChild(container);

            main.appendChild(section);
        });

        const campanhasSeguidas = campanhasExistentes
            .filter(c => c.status && c.status.toUpperCase() === 'ATIVA')
            .map(c => c.titulo);

        const campanhasProximas = campanhasDoBackend
            .filter(c => c.dt_inicio && new Date(c.dt_inicio) > new Date())
            .map(c => c.titulo);


        if (campanhasSeguidas.length > 0) {
            campanhasSeguidas.forEach(seguida => {
                const li = document.createElement('li');
                li.textContent = seguida;
                campanhasSeguidasLista.appendChild(li);
            });
        } else {
            campanhasSeguidasLista.innerHTML = '<li>Nenhuma campanha seguida no momento.</li>'
        }

        if (campanhasProximas.length > 0) {
            campanhasProximas.forEach(proxima => {
                const li = document.createElement('li');
                li.textContent = proxima;
                campanhasProximasLista.appendChild(li);
            });
        } else {
            campanhasProximasLista.innerHTML = '<li>Nenhuma campanha próxima no momento.</li>'
        }

    } catch (error){
        console.error('Erro ao buscar campanhas:', error);
        main.innerHTML= '<p> Não foi possivel carregar as campanhas </p>';
        campanhasSeguidasLista.innerHTML = '<li> Erro ao carregar </li>';
        campanhasProximasLista.innerHTML = '<li> Erro ao carregar </li>';
    }
}

document.addEventListener('DOMContentLoaded', () =>{
    renderizaCampanhas();
});