// Simulação de dados da campanha
const campaignData = {
    name: "Campanha de Arrecadação de Alimentos",
    items: ["Arroz 5kg", "Feijão 1kg", "Óleo de Soja", "Macarrão", "Leite em pó"],
    startDate: "20/05/2025",
    endDate: "20/06/2025",
    location: "Coordenadas: Lat -25.1234, Lon -49.5678. Local: Centro Comunitário ABC",
    category: "Alimentação",
    certificate: "Selo Organização Confiável",
    description: "Esta campanha visa arrecadar alimentos não perecíveis para famílias em situação de vulnerabilidade em nossa comunidade. Contamos com sua ajuda para fazermos a diferença na vida de quem mais precisa. Doe, compartilhe, participe!"
};

// Simulação de comentários com respostas
let comments = [
    {
        id: 1,
        userName: "Usuário Exemplo 1",
        text: "Ótima iniciativa! Como posso me voluntariar para ajudar na coleta dos alimentos?",
        replies: [
            {
                id: 11,
                userName: "Organizador",
                text: "Você pode se inscrever pelo botão 'Voluntariar-se' acima!",
                replies: []
            }
        ]
    },
    {
        id: 2,
        userName: "Maria Silva",
        text: "Já fiz minha doação. Parabéns pelo projeto!",
        replies: []
    }
];

// Preenche dados da campanha
function loadCampaignData() {
    document.getElementById('campaignNameHeader').textContent = campaignData.name;
    document.getElementById('campaignStartDate').textContent = campaignData.startDate;
    document.getElementById('campaignEndDate').textContent = campaignData.endDate;
    document.getElementById('campaignLocation').innerHTML = campaignData.location;
    document.getElementById('campaignCategory').textContent = campaignData.category;
    document.getElementById('campaignCertificate').textContent = campaignData.certificate;
    document.getElementById('campaignDescriptionText').textContent = campaignData.description;

    const itemsUl = document.getElementById('campaignItems');
    itemsUl.innerHTML = '';
    campaignData.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        itemsUl.appendChild(li);
    });
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
    commentTextDiv.textContent = comment.text;

    // Botão responder
    const replyBtn = document.createElement('button');
    replyBtn.classList.add('reply-btn');
    replyBtn.textContent = "Responder";
    replyBtn.onclick = function () {
        replyForm.style.display = replyForm.style.display === "none" ? "flex" : "none";
    };

    // Formulário de resposta
    const replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');
    replyForm.style.display = "none";
    replyForm.innerHTML = `
        <input type="text" class="reply-input" placeholder="Responder...">
        <button type="submit">Enviar</button>
    `;
    replyForm.onsubmit = function (e) {
        e.preventDefault();
        const input = replyForm.querySelector('.reply-input');
        const replyText = input.value.trim();
        if (replyText) {
            // Em um sistema real, envie para o backend aqui!
            const newReply = {
                id: Date.now(),
                userName: "Usuário Logado",
                text: replyText,
                replies: []
            };
            comment.replies.push(newReply);
            loadComments(); // Re-renderiza tudo
        }
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

// Adiciona novo comentário principal
document.addEventListener('DOMContentLoaded', function () {
    loadCampaignData();
    loadComments();

    const addCommentForm = document.getElementById('addCommentForm');
    const newCommentInput = document.getElementById('newCommentInput');
    addCommentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const commentText = newCommentInput.value.trim();
        if (commentText) {
            const newComment = {
                id: Date.now(),
                userName: "Usuário Logado",
                text: commentText,
                replies: []
            };
            comments.push(newComment);
            loadComments();
            newCommentInput.value = '';
        }
    });
});