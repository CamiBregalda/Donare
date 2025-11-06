import { fetchData } from './lib/auth.js';
const API_BASE = 'http://localhost:8080';
function authHeaders(isJson = true) {
	const response = { Authorization: `Bearer ${token}` };
	if (isJson) response['Content-Type'] = 'application/json';
	return response;
}
const usuario  = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId   = usuario.id;

const token = localStorage.getItem('token') || '';
if (!token || !userId) {
  alert('Usuário não autenticado.');
  window.location.href = 'login.html';
  throw new Error('Não autenticado');
}

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
const campanhaId = getIdFromUrl();
const idCampanha = campanhaId;

let comments = [];

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

        const usuario = await fetchData();
        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }
        // Busca dados da campanha
        const campResponse = await fetch(`${API_BASE}/campanhas/${campanhaId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!campResponse.ok) throw new Error('Erro ao buscar dados da campanha');
        const campData = await campResponse.json();
        const endereco = campData.endereco;
        let enderecoStr = '';
        if (endereco) {
            enderecoStr = `${endereco.logradouro}, ${endereco.numero}`;
            if (endereco.complemento) enderecoStr += `, ${endereco.complemento}`;
            enderecoStr += ` - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
        }

        document.getElementById('campaignNameHeader').textContent = campData.titulo || '';
        document.getElementById('campaignStartDate').textContent = formatDateBr(campData.dtInicio);
        document.getElementById('campaignEndDate').textContent = formatDateBr(campData.dt_fim);
        document.getElementById('campaignLocation').textContent = enderecoStr || '';
        document.getElementById('campaignCategory').textContent = campData.categoriaCampanha || '';

        const imgResp = await fetch(`${API_BASE}/campanhas/${idCampanha}/imagem`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const imgPlaceholder = document.querySelector('.campaign-image-placeholder');
        if (imgPlaceholder) {
            imgPlaceholder.innerHTML = '';
            if (imgResp.ok) {
                const blob = await imgResp.blob();
                const imgUrl = URL.createObjectURL(blob);
                const imgEl = document.createElement('img');
                imgEl.id = 'campaignImage';
                imgEl.alt = 'Imagem da campanha';
                imgEl.style.maxWidth = '100%';
                imgEl.style.display = 'block';
                imgEl.src = imgUrl;
                imgPlaceholder.appendChild(imgEl);
            }
            if (campData.organizador) {
                const orgDiv = document.createElement('div');
                orgDiv.className = 'organizador-info';
                orgDiv.innerHTML = `<span style="font-weight:600;">Publicação feita por:</span> 
                    <a href="InstitutoUser.html?organizador=${encodeURIComponent(campData.organizador)}" 
                    style="color: #007bff; text-decoration: underline; cursor: pointer;">
                    ${campData.organizador}
                    </a>`;
                imgPlaceholder.appendChild(orgDiv);
            }
        }

        document.getElementById('campaignDescriptionText').textContent = campData.descricao || '';

        const necessidadesResponse = await fetch(`${API_BASE}/necessidade/campanhas/${idCampanha}/necessidades`, {
            headers: authHeaders(false)
        });
        if (!necessidadesResponse.ok) throw new Error('Erro ao buscar necessidades');
        const necessidades = await necessidadesResponse.json();

        const itemsUl = document.getElementById('campaignItems');
        itemsUl.innerHTML = '';

        if (Array.isArray(necessidades) && necessidades.length > 0) {
            necessidades.forEach(item => {
                const porcentagem = item.quantidadeNecessaria > 0
                    ? Math.min(100, (item.quantidadeRecebida / item.quantidadeNecessaria) * 100)
                    : 0;
                const li = document.createElement('li');

                li.innerHTML = `
                    <div class="item-info">
                        <span class="item-name">${item.nome}</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar" style="width: ${porcentagem}%;"></div>
                    </div>
                    <span class="item-arrecadado">Meta: ${item.quantidadeNecessaria} ${item.unidadeMedida || ''}</span>
                `;
                itemsUl.appendChild(li);
            });

        } else {
            itemsUl.innerHTML = '<li>Nenhuma necessidade cadastrada.</li>';
        }
        await loadCampaignPosts();

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
    }
}

async function loadCampaignPosts() {

    try {
        const postsResponse = await fetch(`${API_BASE}/postagens/campanhas/${idCampanha}`, {
            headers: authHeaders(false)
        });
        if (!postsResponse.ok) throw new Error('Erro ao buscar postagens');
        const posts = await postsResponse.json();

        const postsSection = document.getElementById('campaignPostsSection');
        const postsList = postsSection.querySelector('.posts-list');
        postsList.innerHTML = '';

        if (Array.isArray(posts) && posts.length > 0) {
            for (const post of posts) {
                let imgUrl = '../img/icone.png';
                try {
                    const imgResp = await fetch(`${API_BASE}/postagens/${post.id}/midia`, {
                        headers: authHeaders(false)
                    });
                    if (imgResp.ok) {
                        const blob = await imgResp.blob();
                        imgUrl = URL.createObjectURL(blob);
                    }
                } catch (e) {
                    
                }

                const postDiv = document.createElement('div');
                postDiv.className = 'post-card';
                postDiv.innerHTML = `
                    <img src="${imgUrl}" alt="Imagem da postagem" class="post-image">
                    <div class="post-content">
                        <h4 class="post-title">${post.titulo || 'Título da postagem'}</h4>
                        <p class="post-text">${post.conteudo || ''}</p>
                    </div>
                `;
                postsList.appendChild(postDiv);
            }
        } else {
            postsList.innerHTML = '<p>Nenhuma postagem Realizada.</p>';
        }
    } catch (err) {
        console.error(err);

    }
}

async function fetchComments() {
    try {
        const usuario = await fetchData();
        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }

        const response = await fetch(`${API_BASE}/comentario/campanhas/${idCampanha}/comentarios`, {
            headers: authHeaders(false)
        });
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        const data = await response.json();
        comments = buildCommentsTree(data);
        loadComments();
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar comentários!');
    }
}

function buildCommentsTree(commentsList) {
    const map = {};
    const roots = [];
    commentsList.forEach(c => {
        map[c.id] = { ...c, replies: [] };
    });
    commentsList.forEach(c => {
        if (c.idComentarioPai && map[c.idComentarioPai]) {
            map[c.idComentarioPai].replies.push(map[c.id]);
        } else {
            roots.push(map[c.id]);
        }
    });
    return roots;
}

async function sendComment(conteudo, idComentarioPai = null) {
    const usuario = await fetchData();


    if (!usuario) {
        console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
        alert("Você não está autenticado! Faça login novamente.");
        window.location.href = "Login.html";
    }

    const body = {
        conteudo,
        userEmail: usuario.email,
        idComentarioPai
    };
    const response = await fetch(`${API_BASE}/comentario/campanhas/${campanhaId}/comentarios`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        alert('Erro ao enviar comentário!');
        return;
    }
    await fetchComments();
}

async function deleteComment(idComentario) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Você não está autenticado! Faça login novamente.");
        window.location.href = "Login.html";
        return;
    }
    const body = {
        conteudo: "string", //ajustar com o gabriel
        userEmail: usuario.email,
        idComentarioPai: null
    };
    const response = await fetch(`${API_BASE}/comentario/comentarios/${idComentario}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        alert('Erro ao excluir comentário!');
        return;
    }
    await fetchComments();
}

function renderComment(comment, parentElement) {
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');

    const avatar = document.createElement('div');
    avatar.classList.add('comment-user-avatar');

    if (comment.userResponseDTO && comment.userResponseDTO.id) {
        fetch(`${API_BASE}/usuarios/${comment.userResponseDTO.id}`, {
            headers: authHeaders(false) 
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && data.midia) {
                    const img = document.createElement('img');
                    img.src = `data:${data.midiaContentType};base64,${data.midia}`;
                    img.alt = "Avatar";
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "50%";
                    avatar.innerHTML = '';
                    avatar.appendChild(img);
                } else {
                    const img = document.createElement('img');
                    img.src = '../img/user.png';
                    img.alt = "Avatar";
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "50%";
                    avatar.innerHTML = '';
                    avatar.appendChild(img);
                }
            });
    } else {
        const img = document.createElement('img');
        img.src = '../img/user.png';
        img.alt = "Avatar";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.borderRadius = "50%";
        avatar.innerHTML = '';
        avatar.appendChild(img);
    }

    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');

    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('user-name');
    userNameDiv.textContent = (comment.userResponseDTO && comment.userResponseDTO.nome) ? comment.userResponseDTO.nome : 'Usuário';

    const commentTextDiv = document.createElement('div');
    commentTextDiv.classList.add('comment-text');
    commentTextDiv.textContent = comment.conteudo;


    const replyBtn = document.createElement('button');
    replyBtn.classList.add('reply-btn');
    replyBtn.textContent = "Responder";
    replyBtn.onclick = function () {
        replyForm.style.display = replyForm.style.display === "none" ? "flex" : "none";
    };


    const replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');
    replyForm.style.display = "none";
    replyForm.innerHTML = `
        <input type="text" class="reply-input" placeholder="Responder...">
        <button type="submit">Enviar</button>
    `;
    replyForm.onsubmit = async function (e) {
    e.preventDefault();
    const input = replyForm.querySelector('.reply-input');
    const replyBtn = replyForm.querySelector('button[type="submit"]');
    const replyText = input.value.trim();
    if (replyText) {
        replyBtn.disabled = true;
        await sendComment(replyText, comment.id);
        input.value = '';
        replyBtn.disabled = false; 
        replyForm.style.display = "none";
    }
};

    commentContent.appendChild(userNameDiv);
    commentContent.appendChild(commentTextDiv);
    commentContent.appendChild(replyBtn);
    commentContent.appendChild(replyForm);


    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && comment.userResponseDTO && comment.userResponseDTO.id === usuario.id) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = "Excluir comentário";
        deleteBtn.innerHTML = '<span>&#128465</span>';
        deleteBtn.onclick = async function () {
            if (confirm("Tem certeza que deseja excluir este comentário?")) {
                await deleteComment(comment.id);
            }
        };
        commentItem.appendChild(deleteBtn);
    }


    const mainContent = document.createElement('div');
    mainContent.classList.add('comment-main-content');
    mainContent.appendChild(avatar);
    mainContent.appendChild(commentContent);
    commentItem.appendChild(mainContent);


    if (comment.replies && comment.replies.length > 0) {
        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies-container');
        comment.replies.forEach(reply => renderComment(reply, repliesContainer));
        commentItem.appendChild(repliesContainer);
    }

    parentElement.appendChild(commentItem);
}


function loadComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    comments.forEach(comment => renderComment(comment, commentsList));
}

document.addEventListener('DOMContentLoaded', function () {
    loadCampaignData();
    fetchComments();

    const addCommentForm = document.getElementById('addCommentForm');
    const newCommentInput = document.getElementById('newCommentInput');
    const submitBtn = addCommentForm.querySelector('button[type="submit"]');

    addCommentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const commentText = newCommentInput.value.trim();
        if (commentText) {
            submitBtn.disabled = true;
            await sendComment(commentText, null);
            newCommentInput.value = '';
            submitBtn.disabled = false; 
        }
    });

    const followBtn = document.querySelector('.btn-follow');
    if (followBtn) {
        let isFollowing = false;

        function updateFollowButton(following) {
            followBtn.textContent = following ? 'Seguindo' : 'Seguir';
            followBtn.dataset.following = following ? "true" : "false";
        }

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.id) {
            fetch(`${API_BASE}/campanhas/${idCampanha}`, {
                headers: authHeaders(false) 
            })
                .then(resp => resp.ok ? resp.json() : null)
                .then(campData => {
                    if (campData && Array.isArray(campData.usuariosQueSeguem)) {
                        isFollowing = campData.usuariosQueSeguem.some(u => u.id === usuario.id);
                        updateFollowButton(isFollowing);
                    }
                });
        }

        followBtn.addEventListener('click', async function () {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (!usuario || !usuario.id) {
                alert("Você não está autenticado! Faça login novamente.");
                window.location.href = "Login.html";
                return;
            }
            const idUsuario = usuario.id;

            if (!isFollowing) {
                // Seguir campanha
                try {
                    const resp = await fetch(`${API_BASE}/usuarios/${idUsuario}/seguir-campanha/${idCampanha}`, {
                        method: 'POST',
                        headers: authHeaders(false) 
                    });
                    if (resp.ok) {
                        isFollowing = true;
                        updateFollowButton(true);
                    } else {
                        const errorText = await resp.text();
                        alert('Erro ao seguir campanha: ' + errorText);
                    }
                } catch (err) {
                    alert('Erro ao seguir campanha.');
                    console.error(err);
                }
            } else {
                try {
                    const resp = await fetch(`${API_BASE}/usuarios/${idUsuario}/parar-de-seguir-campanha/${idCampanha}`, {
                        method: 'DELETE',
                        headers: authHeaders(false) 
                    });
                    if (resp.ok) {
                        isFollowing = false;
                        updateFollowButton(false);
                    } else {
                        const errorText = await resp.text();
                        alert('Erro ao parar de seguir: ' + errorText);
                    }
                } catch (err) {
                    alert('Erro ao parar de seguir.');
                    console.error(err);
                }
            }
        });
    }

    document.querySelector('.back-button').addEventListener('click', function (e) {
        e.preventDefault();
        window.history.back();
    });
});
