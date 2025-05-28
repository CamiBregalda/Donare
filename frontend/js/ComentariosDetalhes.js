const idCampanha = 1; // Troque pelo id real da campanha
let comments = [];

// Carrega dados da campanha e necessidades
async function loadCampaignData() {
    try {
        const response = await fetch(`http://localhost:8080/necessidade/campanhas/${idCampanha}/post`);
        if (!response.ok) throw new Error('Erro ao buscar dados da campanha');
        const data = await response.json();

        document.getElementById('campaignNameHeader').textContent = data.tituloCampanha || '';
        document.getElementById('campaignStartDate').textContent = data.campanhaDtInicio || '';
        document.getElementById('campaignEndDate').textContent = data.campanhaDtFim || '';
        document.getElementById('campaignLocation').innerHTML = data.campanhaEndereço || '';
        document.getElementById('campaignCategory').textContent = data.campanhaCategoria || '';
        document.getElementById('campaignCertificate').textContent = data.campanhaTipoCertificado || '';
        document.getElementById('campaignDescriptionText').textContent = data.campanhaDescricao || '';

        const itemsUl = document.getElementById('campaignItems');
        itemsUl.innerHTML = '';
        if (Array.isArray(data.necessidades)) {
            data.necessidades.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.nome} (Necessário: ${item.quantidadeNecessaria})`;
                itemsUl.appendChild(li);
            });
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
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
        map[c.id] = {...c, replies: []};
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
    if (!userEmail) {
        alert('Você precisa estar logado para comentar.');
        return;
    }
    const body = {
        conteudo,
        userEmail,
        idComentarioPai,
        campanhaId: idCampanha
    };
    const response = await fetch(`http://localhost:8080/comentario/campanha/${idCampanha}/comentarios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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
        `http://localhost:8080/comentario/campanhas/${idCampanha}/comentarios/${idComentario}?userEmail=${encodeURIComponent(userEmail)}`,
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

    // Avatar
    const avatar = document.createElement('div');
    avatar.classList.add('comment-user-avatar');
    avatar.innerHTML = '<span>&#128100;</span>';

    // Conteúdo
    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');

    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('user-name');
    userNameDiv.textContent = comment.userName;

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