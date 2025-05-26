// Simulação de dados da campanha que viriam do backend
const campaignData = {
    name: "Campanha de Arrecadação de Alimentos",
    items: ["Arroz 5kg", "Feijão 1kg", "Óleo de Soja", "Macarrão"],
    startDate: "20/05/2025",
    endDate: "20/06/2025",
    location: "Coordenadas: Lat -25.1234, Lon -49.5678. Local: Centro Comunitário ABC",
    category: "Alimentação",
    certificate: "Selo Organização Confiável",
    description: "Esta campanha visa arrecadar alimentos não perecíveis para famílias em situação de vulnerabilidade em nossa comunidade. Contamos com sua ajuda para fazermos a diferença na vida de quem mais precisa. Doe, compartilhe, participe!"
};

// Função para carregar dados da campanha na página
function loadCampaignData() {
    document.getElementById('campaignNameHeader').textContent = campaignData.name;

    const itemsList = document.getElementById('campaignItems');
    itemsList.innerHTML = ''; // Limpa itens de exemplo
    campaignData.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `-${item}`;
        itemsList.appendChild(li);
    });
    const userPhotoUrl = "https://randomuser.me/api/portraits/men/32.jpg"; // Troque pela URL real

    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.innerHTML = `<img src="${userPhotoUrl}" alt="Foto do usuário">`;
    }

    document.getElementById('campaignStartDate').textContent = campaignData.startDate;
    document.getElementById('campaignEndDate').textContent = campaignData.endDate;
    document.getElementById('campaignLocation').textContent = campaignData.location;
    document.getElementById('campaignCategory').textContent = campaignData.category;
    document.getElementById('campaignCertificate').textContent = campaignData.certificate;
    // document.getElementById('campaignDescriptionTitle').textContent = `Descrição da ${campaignData.name}:`; // Opcional, se quiser dinâmico
    document.getElementById('campaignDescriptionText').textContent = campaignData.description;

    // fetch('/api/campaign/ID_DA_CAMPANHA') // Exemplo de chamada real
    //  .then(response => response.json())
    //  .then(data => { /* Atualizar os elementos com data */ });
}

// Simulação de comentários que viriam do backend
let comments = [
    {
        userName: "Usuário Exemplo 1",
        text: "Ótima iniciativa! Como posso me voluntariar para ajudar na coleta dos alimentos?"
    },
    {
        userName: "Maria Silva",
        text: "Já fiz minha doação. Parabéns pelo projeto!"
    }
];

const commentsList = document.getElementById('commentsList');
const addCommentForm = document.getElementById('addCommentForm');
const newCommentInput = document.getElementById('newCommentInput');

// Função para renderizar um único comentário
function renderComment(comment) {
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');

    // Avatar do usuário (placeholder)
    const avatar = document.createElement('div');
    avatar.classList.add('comment-user-avatar');
    // Poderia adicionar uma imagem ou iniciais aqui se tivesse
    // avatar.textContent = comment.userName.substring(0,1); 

    // Conteúdo do comentário
    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');

    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('user-name');
    userNameDiv.textContent = comment.userName;

    const commentTextDiv = document.createElement('div');
    commentTextDiv.classList.add('comment-text');
    commentTextDiv.textContent = comment.text;

    commentContent.appendChild(userNameDiv);
    commentContent.appendChild(commentTextDiv);

    commentItem.appendChild(avatar);
    commentItem.appendChild(commentContent);

    commentsList.appendChild(commentItem); // Adiciona no final da lista
    // Para adicionar no início: commentsList.prepend(commentItem);
}

// Função para carregar e renderizar todos os comentários
function loadComments() {
    commentsList.innerHTML = ''; // Limpa os comentários de exemplo do HTML estático

    // fetch('/api/campaign/ID_DA_CAMPANHA/comments') // Exemplo de chamada GET real
    //  .then(response => response.json())
    //  .then(fetchedComments => {
    //      comments = fetchedComments; // Atualiza a variável local
    //      comments.forEach(comment => renderComment(comment));
    //  });

    // Usando os dados simulados por enquanto:
    comments.forEach(comment => renderComment(comment));
}

// Event listener para adicionar novo comentário
addCommentForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o recarregamento da página
    const commentText = newCommentInput.value.trim();

    if (commentText) {
        const newComment = {
            // Em um sistema real, o userName viria do usuário logado
            userName: "Novo Usuário Logado",
            text: commentText
        };

        // Aqui você faria a chamada POST para o backend
        // fetch('/api/campaign/ID_DA_CAMPANHA/comments', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newComment)
        // })
        // .then(response => response.json())
        // .then(savedComment => {
        //     renderComment(savedComment); // Adiciona o comentário retornado pelo backend
        //     newCommentInput.value = ''; // Limpa o campo
        // })
        // .catch(error => console.error('Erro ao postar comentário:', error));

        // Simulação local:
        renderComment(newComment); // Adiciona o novo comentário à lista na interface
        comments.push(newComment); // Adiciona ao array local (apenas para simulação)
        newCommentInput.value = ''; // Limpa o campo de input
    }
});

// Carregar dados iniciais quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    loadCampaignData(); // Carrega informações da campanha
    loadComments(); // Carrega comentários iniciais
});