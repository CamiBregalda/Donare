import { fetchData } from "./lib/auth.js";

const usuario = await fetchData();

if (!usuario) {
      console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
      return;
}

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
const idCampanha = getIdFromUrl();

const token = localStorage.getItem('token');
function authHeadersForm() {
  return { 'Authorization': `Bearer ${token}` };
}

//formatação da data apenas
function formatDateBr(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

async function loadCampaignData() {
    try {
  
        const campResponse = await fetch(`http://localhost:8080/campanhas/${idCampanha}`);
        if (!campResponse.ok) throw new Error('Erro ao buscar dados da campanha');
        const campData = await campResponse.json();

        document.querySelector('.campaign-name-header').textContent = campData.titulo || '';
        document.getElementById('campaignStartDate').textContent = formatDateBr(campData.dt_inicio);
        document.getElementById('campaignEndDate').textContent = formatDateBr(campData.dt_fim);
        document.getElementById('campaignLocation').textContent = campData.endereco || '';
        document.getElementById('campaignCategory').textContent = campData.categoriaCampanha || '';
        document.getElementById('campaignDescriptionText').textContent = campData.descricao || '';

        const imgResp = await fetch(`http://localhost:8080/campanhas/${idCampanha}/imagem`);
        if (imgResp.ok) {
            const blob = await imgResp.blob();
            const imgUrl = URL.createObjectURL(blob);
            const imgEl = document.querySelector('.campaign-image');
            if (imgEl) {
                imgEl.src = imgUrl;
                imgEl.alt = 'Imagem da campanha';
            }
        }

        const response = await fetch(`http://localhost:8080/necessidade/campanhas/${idCampanha}/necessidades`);
        if (!response.ok) throw new Error('Erro ao buscar necessidades');
        const necessidades = await response.json();

        const itemList = document.querySelector('.item-list');
        itemList.innerHTML = '';
        if (!Array.isArray(necessidades) || necessidades.length === 0) {
            itemList.innerHTML = '<p>Nenhuma necessidade cadastrada.</p>';
            return;
        }
        necessidades.forEach(item => {
            const porcentagem = item.quantidadeNecessaria > 0
                ? Math.min(100, (item.quantidadeRecebida / item.quantidadeNecessaria) * 100)
                : 0;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.nome}</span>
                    <span class="item-meta">Meta: ${item.quantidadeNecessaria} ${item.unidadeMedida || ''}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar" style="width: ${porcentagem}%;"></div>
                </div>
                <div class="item-bottom">
                    <span class="item-arrecadado">Arrecadado: ${item.quantidadeRecebida} ${item.unidadeMedida || ''}</span>
                    <div class="adm-controls">
                        <button class="btn-add" data-id="${item.id}" data-action="add">+</button>
                        <button class="btn-remove" data-id="${item.id}" data-action="remove">-</button>
                    </div>
                </div>
            `;
            itemList.appendChild(itemDiv);
        });

        itemList.querySelectorAll('.btn-add, .btn-remove').forEach(btn => {
            btn.addEventListener('click', async function () {
                const idNecessidade = this.getAttribute('data-id');
                const action = this.getAttribute('data-action');
                const necessidade = necessidades.find(n => n.id == idNecessidade);
                if (!necessidade) return;

                let novaQtd = necessidade.quantidadeRecebida;
                if (action === 'add') {
                    if (novaQtd < necessidade.quantidadeNecessaria) {
                        novaQtd++;
                    } else {
                  
                        return;
                    }
                } else if (action === 'remove' && novaQtd > 0) {
                    novaQtd--;
                } else {
                    return;
                }

                await updateNecessidade(idNecessidade, novaQtd, necessidade);
            });
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
    }
}


window.onclick = (e) => {
    
    if (e.target === modalPost) modalPost.style.display = 'none';
};

async function updateNecessidade(idNecessidade, novaQtd, necessidade) {
    try {
        const response = await fetch(`http://localhost:8080/necessidade/necessidades/${idNecessidade}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: necessidade.nome,
                quantidadeNecessaria: necessidade.quantidadeNecessaria,
                quantidadeRecebida: novaQtd,
                unidadeMedida: necessidade.unidadeMedida
            })
        });
        if (!response.ok) throw new Error('Erro ao atualizar necessidade');
        await loadCampaignData();
    } catch (err) {
        alert('Erro ao atualizar necessidade!');
    }
}

const btnAddPost = document.getElementById('btnAddPost');
const modalPost = document.getElementById('modalPost');
const closeModalPost = document.getElementById('closeModalPost');
const formPost = document.getElementById('formPost');
const cancelPost = document.getElementById('cancelPost');
const imgPreview = document.getElementById('imgPreview');
let editingPost = null;

btnAddPost.onclick = () => openPostModal();
closeModalPost.onclick = () => closePostModal();
cancelPost.onclick = () => closePostModal();

function openPostModal(post = null) {
    editingPost = post;
    formPost.reset();
    imgPreview.innerHTML = '';
    document.getElementById('modalPostTitle').textContent = post ? 'Editar Postagem' : 'Nova Postagem';
    document.getElementById('createPost').textContent = post ? 'Salvar' : 'Criar';
    if (post) {
        document.getElementById('postTitulo').value = post.titulo;
        document.getElementById('postConteudo').value = post.conteudo;
        if (post.midia) {
            imgPreview.innerHTML = `<img src="${post.midia}" alt="midia">`;
        }
    }
    modalPost.style.display = 'flex';
}

function closePostModal() {
    modalPost.style.display = 'none';
    editingPost = null;
}

document.getElementById('postImagem').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
            imgPreview.innerHTML = `<img src="${ev.target.result}" alt="midia">`;
        };
        reader.readAsDataURL(file);
    } else {
        imgPreview.innerHTML = '';
    }
});

async function loadPosts() {
    const postList = document.querySelector('.post-list');
    postList.innerHTML = '<p>Carregando...</p>';
    try {
        const resp = await fetch(`http://localhost:8080/postagens/campanhas/${idCampanha}`);
        if (!resp.ok) throw new Error('Erro ao buscar postagens');
        const posts = await resp.json();
        if (!Array.isArray(posts) || posts.length === 0) {
            postList.innerHTML = '<p>Nenhuma postagem ainda.</p>';
            return;
        }
        postList.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.innerHTML = `
                <div class="post-card-actions">
                    <button class="btn-edit" title="Editar"><span>&#9998;</span></button>
                    <button class="btn-delete" title="Excluir"><span>&#128465;</span></button>
                </div>
                ${post.midia ? `<img src="${post.midia}" alt="midia">` : ''}
                <div class="post-card-title">${post.titulo}</div>
                <div class="post-card-content">${post.conteudo}</div>
            `;

            card.querySelector('.btn-edit').onclick = () => openPostModal(post);

            card.querySelector('.btn-delete').onclick = async () => {
                if (confirm('Deseja realmente excluir esta postagem?')) {
                    await fetch(`http://localhost:8080/postagens/${post.id}`, { method: 'DELETE' });
                    loadPosts();
                }
            };
            postList.appendChild(card);
        });
    } catch {
        postList.innerHTML = '<p>Erro ao carregar postagens.</p>';
    }
}

formPost.onsubmit = async function (e) {
    e.preventDefault();
    const titulo = document.getElementById('postTitulo').value;
    const conteudo = document.getElementById('postConteudo').value;
    const file = document.getElementById('postImagem').files[0];

    let url = '';
    let method = 'POST';
    let body = new FormData();

    const postagem = {
        idCampanha: idCampanha,
        titulo: titulo,
        conteudo: conteudo
    };
    body.append('postagem', new Blob([JSON.stringify(postagem)], { type: 'application/json' }));
    if (file) body.append('midia', file);

    if (editingPost) {
        url = `http://localhost:8080/postagens/${editingPost.id}`;
        method = 'PUT';
    } else {
        url = `http://localhost:8080/postagens/campanhas/${idCampanha}`;
        method = 'POST';
    }

    try {
        await fetch(url, {
            method,
            body
        });
        closePostModal();
        loadPosts();
    } catch {
        alert('Erro ao salvar postagem!');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadCampaignData();
    loadPosts();

    document.querySelector('.back-button').addEventListener('click', function (e) {
    e.preventDefault();
    window.history.back();
});
});