import { fetchData } from "./lib/auth.js";

const API_BASE = 'http://localhost:8080';
function authHeaders(isJson = true) {
    const token = localStorage.getItem('token') || '';
    const response = { Authorization: `Bearer ${token}` };
    if (isJson) response['Content-Type'] = 'application/json';
    return response;
}

let todasCampanhas = [];
let main;
let campanhasSeguidasLista;
let campanhasProximasLista;


export async function renderizaCampanhas(listaFiltrada = null) {
    if (!main) {
        console.error('[renderizaCampanhas] main inexistente, abortando');
        return;
    }

    try {

        let exibirCampanhas = [];

        if (listaFiltrada && Array.isArray(listaFiltrada)) {
            exibirCampanhas = listaFiltrada
        } else {
            const usuario = await fetchData();
            if (!usuario) {
                console.warn('[renderizaCampanhas] usuário não autenticado');
                return;
            }

            const cidadeUsuario = usuario?.idEndereco?.cidade;

            const response = await fetch(`${API_BASE}/campanhas`, {
                headers: authHeaders(false)
            });

            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

            todasCampanhas = await response.json();

            const hoje = new Date();
            const campanhasAtivas = todasCampanhas.filter(c => {
                const inicio = new Date(c.dtInicio);
                const fim = new Date(c.dt_fim);
                return inicio <= hoje && fim >= hoje;
            });

            exibirCampanhas = campanhasAtivas;

            atualizarListaCampanhasSeguidas();

            carregaCampanhasProximas(usuario, campanhasAtivas, cidadeUsuario).catch(err => {
                console.warn('[proximas] erro:', err);
                atualizarListaCampanhasProximas([]);
            });
        }

        main.innerHTML = '';

        if (!exibirCampanhas.length) {
            main.innerHTML = '<p>Nenhuma campanha encontrada.</p>';
            return;
        }

        const categoriasCampanhas = exibirCampanhas.reduce((acc, campanha) => {
            const categoria = campanha.categoriaCampanha || 'Outros';
            (acc[categoria] = acc[categoria] || []).push(campanha);
            return acc;
        }, {});
        Object.keys(categoriasCampanhas).forEach(async nomeCategoria => {
            const section = document.createElement('section');
            section.className = 'categoria';
            const titulo = document.createElement('h3');
            titulo.textContent = nomeCategoria;
            const container = document.createElement('div');
            container.className = 'container-campanha';

            for (const campanha of categoriasCampanhas[nomeCategoria]) {
                const card = await criarCardCampanha(campanha);
                container.appendChild(card);
            }

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

async function carregaCampanhasProximas(campanhasAtivas, cidadeUsuario) {
    try {
        const coords = await obterCoordenadasUsuario();

        let campanhasProximasFiltradas = [];

        if (coords) {
            try {
                const r = await fetch(
                    `${API_BASE}/campanhas/proximas?lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
                    }
                );
                if (r.ok) {
                    campanhasProximasFiltradas = await r.json();
                }
            } catch (e) {
                console.warn('[proximas] falha ao buscar por coordenadas:', e);
            }
        } else {

            try {
                if ((!Array.isArray(campanhasProximasFiltradas) || campanhasProximasFiltradas.length === 0) && cidadeUsuario) {
                    campanhasProximasFiltradas = campanhasAtivas.filter(campanha => {
                        const cidadeCampanha = campanha.endereco?.cidade;
                        return cidadeCampanha && cidadeCampanha.toLowerCase() === cidadeUsuario.toLowerCase();
                    });
                }
            } catch (e) {
                console.warn('[proximas] falha ao buscar todas as campanhas:', e);
            }
        }

        atualizarListaCampanhasProximas(campanhasProximasFiltradas);
    } catch (err) {
        console.warn('[proximas] erro inesperado:', err);
        if (cidadeUsuario) {
            const porCidade = campanhasAtivas.filter(c => c.endereco?.cidade?.toLowerCase() === cidadeUsuario.toLowerCase());
            atualizarListaCampanhasProximas(porCidade);
        } else {
            atualizarListaCampanhasProximas([]);
        }
    }
}

async function obterCoordenadasUsuario() {
    if (!('geolocation' in navigator)) return null;

    const options = { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 };

    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                resolve({ latitude, longitude });
            },
            err => {
                console.warn('[geolocation] erro/negado:', err?.message);
                resolve(null);
            },
            options
        );
    });
}

async function carregarImagem(campanhaId, imgElement) {
    const token = (localStorage.getItem('token') || '').trim();
    try {
        const response = await fetch(`${API_BASE}/campanhas/${campanhaId}/imagem`, {
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

    if (campanha.distancia !== undefined && campanha.distancia !== null) {
        li.innerHTML = ` 
        <strong>${campanha.titulo}</strong><br>
        <small>${campanha.distancia.toFixed(0)} km</small>`;
    } else {
        li.textContent = campanha.titulo;
    }
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
        window.location.href = `../pages/ComentariosDetalhes.html?id=${campanha.id}`;
    });
    return li;
}

async function criarCardCampanha(campanha) {
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

    // Verifica se o usuário já segue a campanha
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    let isSeguindo = false;
    try {
        const resp = await fetch(`${API_BASE}/campanhas/${campanha.id}`, {
            headers: authHeaders(false)
        });
        if (resp.ok) {
            const campData = await resp.json();
            if (campData && Array.isArray(campData.usuariosQueSeguem)) {
                isSeguindo = campData.usuariosQueSeguem.some(u => u.id == usuario.id);
            }
        }
    } catch { }

    const btnSeguir = card.querySelector('.seguir');
    atualizarBotaoSeguir(btnSeguir, isSeguindo);

    btnSeguir.addEventListener('click', async (event) => {
        event.stopPropagation();
        if (!usuario || !usuario.id) {
            alert('Você precisa estar logado.');
            window.location.href = 'login.html';
            return;
        }
        if (!isSeguindo) {
            try {
                const response = await fetch(`${API_BASE}/usuarios/${usuario.id}/seguir-campanha/${campanha.id}`, {
                    method: 'POST',
                    headers: authHeaders(false)
                });
                if (response.ok) {
                    isSeguindo = true;
                    atualizarBotaoSeguir(btnSeguir, true);
                } else {
                    alert('Erro ao seguir campanha.');
                }
            } catch {
                alert('Falha ao seguir campanha.');
            }
        } else {
            try {
                const response = await fetch(`${API_BASE}/usuarios/${usuario.id}/parar-de-seguir-campanha/${campanha.id}`, {
                    method: 'DELETE',
                    headers: authHeaders(false)
                });
                if (response.ok) {
                    isSeguindo = false;
                    atualizarBotaoSeguir(btnSeguir, false);
                } else {
                    alert('Erro ao parar de seguir.');
                }
            } catch {
                alert('Falha ao parar de seguir.');
            }
        }
    });

    card.addEventListener('click', (event) => {
        if (!event.target.closest('.seguir')) {
            window.location.href = `../pages/ComentariosDetalhes.html?id=${campanha.id}`;
        }
    });
    return card;
}

function atualizarBotaoSeguir(btn, seguindo) {
    btn.textContent = seguindo ? 'Seguindo' : 'Seguir';
    btn.classList.toggle('seguindo', seguindo);
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

window.renderizaCampanhas = renderizaCampanhas;

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