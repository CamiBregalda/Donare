// Simulação de dados vindos do backend
const campaignData = {
    name: "Campanha de Arrecadação de Alimentos",
    description: "Esta campanha visa arrecadar alimentos não perecíveis para famílias em situação de vulnerabilidade em nossa comunidade. Contamos com sua ajuda para fazermos a diferença na vida de quem mais precisa. Doe, compartilhe, participe!",
    location: 'Coordenadas: Latitude: -25.4422°, Longitude: -49.2091°<br>"Restaurante X"',
    startDate: "20/05/2025",
    endDate: "20/06/2025",
    category: "Alimentação",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    items: [
        { nome: "Arroz 5kg", meta: 50, arrecadado: 50 },
        { nome: "Feijão 1kg", meta: 50, arrecadado: 25 },
        { nome: "Óleo de Soja", meta: 30, arrecadado: 10 },
        { nome: "Macarrão", meta: 40, arrecadado: 20 }
    ]
};

// Função para preencher os dados da campanha
function loadCampaignData() {
    // Nome da campanha
    const nameEl = document.querySelector('.campaign-name-header');
    if (nameEl) nameEl.textContent = campaignData.name;

    // Imagem da campanha
    const imgEl = document.querySelector('.campaign-image');
    if (imgEl) imgEl.src = campaignData.image;

    // Descrição
    const descEl = document.querySelector('.campaign-description p');
    if (descEl) descEl.textContent = campaignData.description;

    // Localização
    const locEl = document.querySelector('.campaign-description p:nth-of-type(2)');
    if (locEl) locEl.innerHTML = campaignData.location;

    // Datas e categoria
    const startEl = document.querySelector('.campaign-description p:nth-of-type(3)');
    if (startEl) startEl.textContent = campaignData.startDate;

    const endEl = document.querySelector('.campaign-description p:nth-of-type(4)');
    if (endEl) endEl.textContent = campaignData.endDate;

    const catEl = document.querySelector('.campaign-description p:nth-of-type(5)');
    if (catEl) catEl.textContent = campaignData.category;

    // Itens necessários
    const itemList = document.querySelector('.item-list');
    if (itemList) {
        itemList.innerHTML = '';
        campaignData.items.forEach(item => {
            const porcentagem = Math.min(100, (item.arrecadado / item.meta) * 100);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.nome}</span>
                    <span class="item-meta">Meta: ${item.meta}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar" style="width: ${porcentagem}%"></div>
                </div>
                <div class="item-bottom">
                    <span class="item-arrecadado">arrecadado: ${item.arrecadado}</span>
                    <button class="btn-add">Adicionar</button>
                </div>
            `;
            itemList.appendChild(itemDiv);
        });
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', loadCampaignData);