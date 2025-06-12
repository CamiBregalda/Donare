

document.addEventListener('DOMContentLoaded', () => {
    const institutionId = 1; // Example institution ID, replace with actual dynamic ID if needed

    fetchInstitutionDetails(institutionId);
    fetchInstitutionCampaigns(institutionId);
});

async function fetchInstitutionDetails(id) {
    try {
        // Replace with your actual API endpoint
   //ver aqui      const response = await fetch(`http://localhost:8080/usuario/${id}`);
         if (!response.ok) throw new Error('Network response was not ok for institution details.');
        const data = await response.json();

        
        

        document.getElementById('institutionName').textContent = data.nome;
        document.getElementById('institutionType').textContent = data.tipo;
        if (data.imagemUrl) {
            document.getElementById('institutionImage').src = data.imagemUrl;
            document.getElementById('institutionImage').alt = `Imagem de ${data.nome}`;
        }
        document.getElementById('institutionLocation').textContent = data.localizacao;
        document.getElementById('institutionHours').textContent = data.horarioFuncionamento;
        document.getElementById('institutionAcceptedDonations').textContent = data.doacoesAceitas;
        document.getElementById('institutionDescriptionText').textContent = data.descricao;

    } catch (error) {
        console.error('Failed to fetch institution details:', error);
        // Display an error message to the user
        document.getElementById('institutionName').textContent = "Erro ao carregar dados da instituição.";
    }
}

async function fetchInstitutionCampaigns(userId) {
    try {
        // Endpoint real para buscar campanhas do usuário/instituição
        const response = await fetch(`http://localhost:8080/campanhas/usuario/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok for campaigns.');
        const campaigns = await response.json();

        const campaignsListDiv = document.getElementById('campaignsList');
        campaignsListDiv.innerHTML = ''; // Limpa campanhas anteriores

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            campaignsListDiv.innerHTML = '<p>Nenhuma campanha ativa no momento.</p>';
            return;
        }

        campaigns.forEach(campaign => {
            const card = document.createElement('div');
            card.className = 'campaign-card';
            card.innerHTML = `
                <div class="campaign-card-image-container">
                    <img src="${campaign.imagemUrl || 'https://via.placeholder.com/300x200?text=Campanha'}" alt="${campaign.titulo}">
                    <span class="campaign-card-title-on-image">${campaign.titulo}</span>
                </div>
                <div class="campaign-card-body">
                    <p class="campaign-card-description">${campaign.descricaoBreve || ''}</p>
                    <div class="campaign-card-actions">
                        <button class="icon-button" aria-label="Curtir"><i class="fas fa-heart"></i></button>
                        <button class="icon-button" aria-label="Comentar"><i class="fas fa-comment"></i></button>
                        <button class="btn-follow-campaign" data-campaign-id="${campaign.id}">${campaign.seguindo ? 'Seguindo' : 'Seguir'}</button>
                        <button class="icon-button" aria-label="Compartilhar"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
            `;
            campaignsListDiv.appendChild(card);
        });

    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
    }
}

// Example function for follow button (needs backend integration)
// function toggleFollowCampaign(campaignId) {
//     console.log(`Toggle follow for campaign ID: ${campaignId}`);
//     // Add logic to update follow status via API and update button text/state
// }