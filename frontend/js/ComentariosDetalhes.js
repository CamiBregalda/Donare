console.log('Script ComentariosDetalhes.js carregado');

import { fetchData } from "./lib/auth.js";



function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
const campanhaId = getIdFromUrl();
const idCampanha = campanhaId;
let comments = [];
console.log('ID da campanha:', campanhaId);


const token = localStorage.getItem('token');
function authHeadersForm() {
    return { 'Authorization': `Bearer ${token}` };
}
// Carrega dados da campanha, necessidades e postagens
async function loadCampaignData() {
    console.log('Chamou loadCampaignData');
    try {

        const usuario = await fetchData();
        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }
        // Busca dados da campanha
        const campResponse = await fetch(`http://localhost:8080/campanhas/${campanhaId}`, {
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
        document.getElementById('campaignStartDate').textContent = campData.dt_inicio ? campData.dt_inicio.split('T')[0] : '';
        document.getElementById('campaignEndDate').textContent = campData.dt_fim ? campData.dt_fim.split('T')[0] : '';
        document.getElementById('campaignLocation').textContent = enderecoStr || '';
        document.getElementById('campaignCategory').textContent = campData.categoriaCampanha || '';
        document.getElementById('campaignCertificate').textContent = campData.tipoCertificado || '';

        // Busca imagem da campanha
        // Busca imagem da campanha
        const imgResp = await fetch(`http://localhost:8080/campanhas/${idCampanha}/imagem`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const imgPlaceholder = document.querySelector('.campaign-image-placeholder');
        if (imgPlaceholder) {
            imgPlaceholder.innerHTML = ''; // Limpa tudo antes de adicionar
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
            // Adiciona o campo do organizador
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

        // Busca necessidades da campanha e renderiza barras de progresso
        const necessidadesResponse = await fetch(`http://localhost:8080/necessidade/campanhas/${idCampanha}/necessidades`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
        // Busca postagens da campanha
        await loadCampaignPosts();

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
    }
}

//Busca postgagens da campanha e rederiza na tela
async function loadCampaignPosts() {

    try {

        const usuario = await fetchData();
        console.log('Usuário retornado:', usuario);


        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }
        const postsResponse = await fetch(`http://localhost:8080/postagens/campanhas/${idCampanha}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!postsResponse.ok) throw new Error('Erro ao buscar postagens');
        const posts = await postsResponse.json();

        const postsSection = document.getElementById('campaignPostsSection');
        const postsList = postsSection.querySelector('.posts-list');
        postsList.innerHTML = '';

        if (Array.isArray(posts) && posts.length > 0) {
            for (const post of posts) {
                let imgUrl = 'https://via.placeholder.com/120x80?text=Postagem';
                // Busca a imagem da postagem, se existir
                try {
                    const imgResp = await fetch(`http://localhost:8080/postagens/${post.id}/midia`);
                    if (imgResp.ok) {
                        const blob = await imgResp.blob();
                        imgUrl = URL.createObjectURL(blob);
                    }
                } catch (e) {
                    // Se der erro, mantém o placeholder
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

        const response = await fetch(`http://localhost:8080/comentario/campanhas/${idCampanha}/comentarios`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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

// Monta árvore de comentários a partir de lista plana
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

// Envia novo comentário ou resposta
async function sendComment(conteudo, idComentarioPai = null) {
    const usuario = await fetchData();
    console.log('Usuário retornado:', usuario);


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
    const response = await fetch(`http://localhost:8080/comentario/campanhas/${campanhaId}/comentarios`, {
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

// Exclui comentário (apenas autor)
async function deleteComment(idComentario) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Você não está autenticado! Faça login novamente.");
        window.location.href = "Login.html";
        return;
    }
    const body = {
        conteudo: "string",
        userEmail: usuario.email,
        idComentarioPai: null
    };
    const response = await fetch(`http://localhost:8080/comentario/comentarios/${idComentario}`, {
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
    if (comment.userImage) {

        avatar.innerHTML = `<img src="data:image/jpeg;base64,${comment.userImage}" alt="Foto do usuário" class="avatar-img">`;

    } else {
        avatar.innerHTML = '<span>&#128100;</span>';
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
        const replyText = input.value.trim();
        if (replyText) {
            await sendComment(replyText, comment.id);
        }
        input.value = '';
        replyForm.style.display = "none";
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
    addCommentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const commentText = newCommentInput.value.trim();
        if (commentText) {
            await sendComment(commentText, null);
            newCommentInput.value = '';
        }
    });

    // Botão de seguir campanha //AJUSTAR A URL

    const followBtn = document.querySelector('.btn-follow');
    if (followBtn) {
        let isFollowing = false;
        function updateFollowButton(following) {
            followBtn.textContent = following ? 'Seguindo' : 'Seguir';
            followBtn.dataset.following = following ? "true" : "false";
        }
        updateFollowButton(isFollowing);

        followBtn.addEventListener('click', async function () {
            // Pega o usuário autenticado do localStorage
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
                    const resp = await fetch(`http://localhost:8080/usuarios/${idUsuario}/seguir-campanha/${idCampanha}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
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
                    const resp = await fetch(`http://localhost:8080/usuarios/${idUsuario}/parar-de-seguir-campanha/${idCampanha}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
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

    // Botão de voluntariado //AJUSTAR A URL
    const volunteerBtn = document.querySelector('.btn-volunteer');
    if (volunteerBtn) {
        volunteerBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
            if (!usuarioLogado || !usuarioLogado.id) {
                alert("Você não está autenticado! Faça login novamente.");
                window.location.href = "Login.html";
                return;
            }
            const userId = usuarioLogado.id;
            try {
                const resp = await fetch(`http://localhost:8080/participacao/participacoes`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        campanhaId: Number(idCampanha),
                        userId: Number(userId)
                    })
                });
                if (resp.ok) {
                    alert('Você se voluntariou com sucesso!');
                } else {
                    const errorText = await resp.text();
                    alert('Erro ao voluntariar-se: ' + errorText);
                    console.error('Erro ao voluntariar-se:', errorText);
                }
            } catch (err) {
                alert('Erro inesperado ao voluntariar-se.');
                console.error('Erro inesperado ao voluntariar-se:', err);
            }
        });
    }

    document.querySelector('.back-button').addEventListener('click', function (e) {
        e.preventDefault();
        window.history.back();
    });
});
