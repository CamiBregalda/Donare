import { jwtDecode } from "./lib/jwt-decode.js";
import { fetchData } from "./lib/auth.js";

function authHeadersForm(token) {
    return { 'Authorization': `Bearer ${token}` };
}

let todasCampanhas = [];
let main;
let campanhasSeguidasLista;
let campanhasProximasLista;

async function renderizaCampanhas() {
    if (!main) {
        console.error('[renderizaCampanhas] main inexistente, abortando');
        return;
    }
    try {
        const usuario = await fetchData();
        if (!usuario) {
            console.warn('[renderizaCampanhas] usuário não autenticado');
            return;
        }

        const cidadeUsuario = usuario?.idEndereco?.cidade;
        const token = (localStorage.getItem('token') || '').trim();

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

        const hoje = new Date();
        const campanhasAtivas = todasCampanhas.filter(c => {
            const inicio = new Date(c.dtInicio);
            const fim = new Date(c.dt_fim);
            return inicio <= hoje && fim >= hoje;
        });

        let campanhasProximasFiltradas = [];
        if (cidadeUsuario) {
            campanhasProximasFiltradas = campanhasAtivas.filter(campanha => {
                const cidadeCampanha = campanha.endereco?.cidade;
                return cidadeCampanha && cidadeCampanha.toLowerCase() === cidadeUsuario.toLowerCase();
            });
        }

        atualizarListaCampanhasProximas(campanhasProximasFiltradas);
        await atualizarListaCampanhasSeguidas();

        main.innerHTML = '';
        const categoriasCampanhas = campanhasAtivas.reduce((acc, campanha) => {
            const categoria = campanha.categoriaCampanha || 'Outros';
            (acc[categoria] = acc[categoria] || []).push(campanha);
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
        console.error('[renderizaCampanhas] erro:', error);
        if (main) main.innerHTML = '<p>Não foi possível carregar as campanhas.</p>';
        if (campanhasSeguidasLista) campanhasSeguidasLista.innerHTML = '<li>Erro ao carregar</li>';
        if (campanhasProximasLista) campanhasProximasLista.innerHTML = '<li>Erro ao carregar</li>';
    }
}

async function carregarImagem(campanhaId, imgElement) {
    const token = (localStorage.getItem('token') || '').trim();
    try {
        const response = await fetch(`http://localhost:8080/campanhas/${campanhaId}/imagem`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            const blob = await response.blob();
            imgElement.src = URL.createObjectURL(blob);
        } else {
            imgElement.src = '../assets/LogoDonareBranca.png';
        }
    } catch {
        imgElement.src = '../assets/LogoDonareBranca.png';
    }
}

function criarItemListaLateral(campanha) {
    const li = document.createElement('li');
    li.textContent = campanha.titulo;
    return li;
}

function criarCardCampanha(campanha) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = campanha.id;
    card.innerHTML = `
        <div class="imagem">
            <img alt="${campanha.titulo}" data-id="${campanha.id}">
        </div>
        <div class="infos">
            <h3>${campanha.titulo}</h3>
            <p>${campanha.descricao || ''}</p>
            <div class="acao">    
                <button class="seguir" data-id="${campanha.id}">Seguir</button>
            </div>
        </div>`;
    const imgElement = card.querySelector('img');
    carregarImagem(campanha.id, imgElement);
    card.addEventListener('click', (event) => {
        if (!event.target.closest('.seguir')) {
            window.location.href = `../pages/ComentariosDetalhes.html?id=${campanha.id}`;
        }
    });
    return card;
}

async function atualizarListaCampanhasSeguidas() {
    if (!campanhasSeguidasLista) return;
    campanhasSeguidasLista.innerHTML = '';
    const token = (localStorage.getItem('token') || '').trim();
    const usuario = await fetchData();
    if (!token || !usuario) {
        campanhasSeguidasLista.innerHTML = '<li>Usuário não autenticado</li>';
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/usuarios/${usuario.id}/campanhas-seguidas`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(response.status);
        const campanhasSeguidas = await response.json();
        if (Array.isArray(campanhasSeguidas) && campanhasSeguidas.length) {
            campanhasSeguidas.forEach(c => campanhasSeguidasLista.appendChild(criarItemListaLateral(c)));
        } else {
            campanhasSeguidasLista.innerHTML = '<li>Nenhuma campanha seguida.</li>';
        }
    } catch (e) {
        campanhasSeguidasLista.innerHTML = '<li>Erro ao carregar.</li>';
    }
}

function atualizarListaCampanhasProximas(campanhasProximas) {
    if (!campanhasProximasLista) return;
    campanhasProximasLista.innerHTML = '';
    if (Array.isArray(campanhasProximas) && campanhasProximas.length) {
        campanhasProximas.forEach(c => campanhasProximasLista.appendChild(criarItemListaLateral(c)));
    } else {
        campanhasProximasLista.innerHTML = '<li>Nenhuma campanha próxima.</li>';
    }
}

async function seguirCampanha(idCampanha) {
    const token = (localStorage.getItem('token') || '').trim();
    const usuario = await fetchData();
    if (!token || !usuario) {
        alert('Você precisa estar logado.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/usuarios/${usuario.id}/seguir-campanha/${idCampanha}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            await atualizarListaCampanhasSeguidas();
            alert('Agora você segue esta campanha.');
        } else {
            const errorResp = await response.json().catch(() => ({}));
            if (response.status === 400 && errorResp.message === 'Usuário já segue esta campanha.') {
                alert('Você já segue esta campanha.');
            } else {
                alert('Erro ao seguir campanha.');
            }
        }
    } catch (e) {
        alert('Falha na requisição.');
    }
}

function onMainClick(event) {
    const btnSeguir = event.target.closest('.seguir');
    if (btnSeguir) {
        event.preventDefault();
        const campanhaId = parseInt(btnSeguir.dataset.id, 10);
        seguirCampanha(campanhaId);
    }
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
    main = document.querySelector('main');
    campanhasSeguidasLista = document.getElementById('campanhas-seguidas');
    campanhasProximasLista = document.getElementById('campanhas-proximas');

    if (!main) {
        console.error('Elemento <main> não encontrado. Verifique o HTML.');
        return;
    }

    main.addEventListener('click', onMainClick);
    renderizaCampanhas();
});