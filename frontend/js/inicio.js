import { jwtDecode } from "./lib/jwt-decode.js";
import { fetchData } from "./lib/auth.js";

let todasCampanhas = [];

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
                <button class="icon-btn" id="comentar" data-id="${campanha.id}">
                    <img src="../assets/fi-rr-comment.png" alt="comentar">
                </button>
                
                <button class="seguir" data-id="${campanha.id}">Seguir</button>
                
                <button class="icon-btn">
                    <img src="../assets/fi-rr-share.png" alt="compartilhar">
                </button>
            </div>
        </div>`;
    return card;
}

async function atualizarListaCampanhasSeguidas() {
    campanhasSeguidasLista.innerHTML = '';

    const token = localStorage.getItem('token');
    const usuario = await fetchData();

    if (!token || !usuario) {
        campanhasSeguidasLista.innerHTML = '<li>Erro ao carregar (Usuário não autenticado)</li>';
        return;
    }

    console.log('ID do Usuário para a requisição:', usuario.id);
    try {
        
        const response = await fetch(`http://localhost:8080/usuarios/${usuario.id}/campanhas-seguidas`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar campanhas seguidas: ${response.status}`);
        }

        const campanhasSeguidas = await response.json();

        if (campanhasSeguidas.length > 0) {
            campanhasSeguidas.forEach(campanha => {
                campanhasSeguidasLista.appendChild(criarItemListaLateral(campanha));
            });
        } else {
            campanhasSeguidasLista.innerHTML = '<li>Nenhuma campanha seguida no momento.</li>';
        }
    } catch {
        
    }
}

function atualizarListaCampanhasProximas(campanhasProximas) {
    campanhasProximasLista.innerHTML = '';
    if (campanhasProximas.length > 0) {
        campanhasProximas.forEach(campanha => {
            campanhasProximasLista.appendChild(criarItemListaLateral(campanha));
        });
    } else {
        campanhasProximasLista.innerHTML = '<li>Nenhuma campanha próxima no momento.</li>';
    }
}


async function seguirCampanha(idCampanha) {
    const token = localStorage.getItem('token');
    const usuario = await fetchData();


    console.log('Dados do usuário:', usuario);
    console.log('ID do usuário:', usuario?.id);
    console.log('ID da campanha a ser seguida:', idCampanha);
    
    if (!token || !usuario) {
        alert('Você precisa estar logado para seguir uma campanha')
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/usuarios/${usuario.id}/seguir-campanha/${idCampanha}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            alert('Campanha seguida com sucesso!');
            await atualizarListaCampanhasSeguidas();
        } else {
            const errorText = await response.text();
            alert(`Erro ao seguir a campanha: ${errorText}`);
            console.error('Erro na requisição para seguir campanha:', response.status, errorText);
        }
    } catch (error) {
        console.error('Erro na rede ou ao seguir campanha:', error);
        alert('Ocorreu um erro ao tentar seguir a campanha. Tente novamente.');
    }
}

async function renderizaCampanhas() {
    try {
        const usuario = await fetchData();

        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            return;
        }

        const cidadeUsuario = usuario?.idEndereco?.cidade;

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/campanhas', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        todasCampanhas = await response.json();
        console.log('Dados da API (todasCampanhas):', todasCampanhas);

        let campanhasProximasFiltradas = [];
        if (cidadeUsuario) {
            campanhasProximasFiltradas = todasCampanhas.filter(campanha => {
                const cidadeCampanha = campanha.endereco?.cidade;
                return cidadeCampanha && cidadeCampanha.toLowerCase() === cidadeUsuario.toLowerCase();
            });
            console.log('Campanhas próximas encontradas:', campanhasProximasFiltradas);
        } else {
            console.warn('Cidade do usuário não definida. A lista de campanhas próximas não pode ser filtrada.');
        }

        atualizarListaCampanhasProximas(campanhasProximasFiltradas);

        await atualizarListaCampanhasSeguidas();

        main.innerHTML = '';
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

    } catch (error) {
        console.error('Erro ao renderizar campanhas:', error);
        main.innerHTML = '<p>Não foi possível carregar as campanhas.</p>';
        campanhasSeguidasLista.innerHTML = '<li>Erro ao carregar</li>';
        campanhasProximasLista.innerHTML = '<li>Erro ao carregar</li>';
    }
}

main.addEventListener('click', (event) => {
    const btnSeguir = event.target.closest('.seguir');
    if (btnSeguir) {
        event.preventDefault();
        const campanhaId = parseInt(btnSeguir.dataset.id, 10);
        seguirCampanha(campanhaId);
    }

    const btnComentar = event.target.closest('#comentar');
    if (btnComentar) {
        event.preventDefault();
        const campanhaId = parseInt(btnComentar.dataset.id, 10);
        window.location.href = `../pages/ComentariosDetalhes.html?id=${campanhaId}`;

    }

});

document.addEventListener('DOMContentLoaded', () => {
    renderizaCampanhas();
});