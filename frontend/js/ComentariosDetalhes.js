const idCampanha = 1; // Troque pelo id real da campanha
let comments = [];

// Carrega dados da campanha, necessidades e postagens
async function loadCampaignData() {
    try {
        // Busca dados da campanha
        const campResponse = await fetch(`http://localhost:8080/campanhas/${idCampanha}`);
        if (!campResponse.ok) throw new Error('Erro ao buscar dados da campanha');
        const campData = await campResponse.json();

        document.getElementById('campaignNameHeader').textContent = campData.titulo || '';
        document.getElementById('campaignStartDate').textContent = campData.dt_inicio ? campData.dt_inicio.split('T')[0] : '';
        document.getElementById('campaignEndDate').textContent = campData.dt_fim ? campData.dt_fim.split('T')[0] : '';
        document.getElementById('campaignLocation').innerHTML = campData.endereco || '';
        document.getElementById('campaignCategory').textContent = campData.categoriaCampanha || '';
        document.getElementById('campaignCertificate').textContent = campData.tipoCertificado || '';

        // Busca imagem da campanha
        const imgResp = await fetch(`http://localhost:8080/campanhas/${idCampanha}/imagem`);
        if (imgResp.ok) {
            const blob = await imgResp.blob();
            const imgUrl = URL.createObjectURL(blob);
            const imgPlaceholder = document.querySelector('.campaign-image-placeholder');
            if (imgPlaceholder) {
                const imgEl = document.createElement('img');
                imgEl.id = 'campaignImage';
                imgEl.alt = 'Imagem da campanha';
                imgEl.style.maxWidth = '100%';
                imgEl.style.display = 'block';
                imgEl.src = imgUrl;
                imgPlaceholder.innerHTML = '';
                imgPlaceholder.appendChild(imgEl);
            }
        }
        document.getElementById('campaignDescriptionText').textContent = campData.descricao || '';

        
        // Busca necessidades da campanha e renderiza barras de progresso
        const necessidadesResponse = await fetch(`http://localhost:8080/necessidade/campanhas/${idCampanha}/necessidades`);
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
        const postsResponse = await fetch(`http://localhost:8080/postagens/campanhas/${idCampanha}`);
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
        // Não exibe alerta para não atrapalhar a experiência
    }
}


// Busca comentários do backend e monta árvore
async function fetchComments() {
    try {
        const response = await fetch(`http://localhost:8080/comentario/campanhas/${idCampanha}/comentarios`);
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
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName'); // Pegue o nome do usuário salvo
    if (!userEmail) {
        alert('Você precisa estar logado para comentar.');
        return;
    }
    const body = {
        conteudo,
        userEmail,
        userName,
        idComentarioPai,
        campanhaId: idCampanha
    };
    const response = await fetch(`http://localhost:8080/comentario/campanhas/${idCampanha}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert('Você precisa estar logado para excluir comentários.');
        return;
    }
    const response = await fetch(
        `http://localhost:8080/comentario/comentarios/${idComentario}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
        alert('Erro ao excluir comentário!');
        return;
    }
    await fetchComments();
}

// Renderização recursiva dos comentários e respostas
function renderComment(comment, parentElement) {
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    console.log(comment);
    // Avatar com foto do usuário (base64 ou URL)
    const avatar = document.createElement('div');
    avatar.classList.add('comment-user-avatar');
    if (comment.userImage) {
        // Se vier base64:
        avatar.innerHTML = `<img src="data:image/jpeg;base64,${comment.userImage}" alt="Foto do usuário" class="avatar-img">`;
        // Se vier URL, use:
        // avatar.innerHTML = `<img src="${comment.userImage}" alt="Foto do usuário" class="avatar-img">`;
    } else {
        avatar.innerHTML = '<span>&#128100;</span>';
    }

    // Conteúdo
   const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');

    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('user-name');
    userNameDiv.textContent = comment.userName || 'Usuário';

    const commentTextDiv = document.createElement('div');
    commentTextDiv.classList.add('comment-text');
    commentTextDiv.textContent = comment.conteudo;

    // Botão responder
    const replyBtn = document.createElement('button');
    replyBtn.classList.add('reply-btn');
    replyBtn.textContent = "Responder";
    replyBtn.onclick = function () {
        replyForm.style.display = replyForm.style.display === "none" ? "flex" : "none";
    };

    // Botão excluir (apenas para o autor)
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && comment.userEmail === userEmail) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('reply-btn');
        deleteBtn.style.color = "#d9534f";
        deleteBtn.textContent = "Excluir";
        deleteBtn.onclick = async function () {
            if (confirm("Tem certeza que deseja excluir este comentário?")) {
                await deleteComment(comment.id);
            }
        };
        commentContent.appendChild(deleteBtn);
    }

    // Formulário de resposta
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

    // Agrupa avatar + conteúdo em um flex container
    const mainContent = document.createElement('div');
    mainContent.classList.add('comment-main-content');
    mainContent.appendChild(avatar);
    mainContent.appendChild(commentContent);
    commentItem.appendChild(mainContent);

    // Container para respostas (abaixo do comentário principal)
    if (comment.replies && comment.replies.length > 0) {
        const repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies-container');
        comment.replies.forEach(reply => renderComment(reply, repliesContainer));
        commentItem.appendChild(repliesContainer);
    }

    parentElement.appendChild(commentItem);
}

// Renderiza todos os comentários
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    comments.forEach(comment => renderComment(comment, commentsList));
}

// Inicialização
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
});