document.addEventListener('DOMContentLoaded', () => {
    const institutionId = 1; // Example institution ID, replace with actual dynamic ID if needed

    fetchInstitutionDetails(institutionId);
    fetchInstitutionCampaigns(institutionId);
});

async function fetchInstitutionDetails(id) {
    try {
        // Replace with your actual API endpoint
        // const response = await fetch(`http://localhost:8080/instituicao/${id}`);
        // if (!response.ok) throw new Error('Network response was not ok for institution details.');
        // const data = await response.json();

        // Mock data for demonstration as API endpoint is not specified
        const data = {
            nome: "Instituição Muito Legal",
            tipo: "Abrigo de Animais",
            imagemUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Placeholder
            localizacao: "Rua Selverino Kubicheck, Centro, Dois Vizinhos, PR",
            horarioFuncionamento: "Seg-Sex: 09:00 - 18:00 / Sab: 09:00 - 12:00",
            doacoesAceitas: "Ração para cães e gatos, cobertores, medicamentos veterinários, brinquedos.",
            descricao: "Somos um abrigo dedicado ao resgate, cuidado e adoção de animais em situação de vulnerabilidade. Nossa missão é oferecer uma segunda chance para cães e gatos, promovendo o bem-estar animal e a conscientização sobre a posse responsável."
        };

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

async function fetchInstitutionCampaigns(institutionId) {
    try {
        // Replace with your actual API endpoint
        // const response = await fetch(`http://localhost:8080/campanhas/instituicao/${institutionId}`);
        // if (!response.ok) throw new Error('Network response was not ok for campaigns.');
        // const campaigns = await response.json();

        // Mock data for demonstration
        const campaigns = [
            {
                id: 1,
                titulo: "Mi de comida!",
                descricaoBreve: "Ajude-nos a alimentar nossos peludos este mês.",
                imagemUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                seguindo: false
            },
            {
                id: 2,
                titulo: "Cobertores Quentinhos",
                descricaoBreve: "O inverno está chegando! Doe cobertores.",
                imagemUrl: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
                seguindo: true
            },
            {
                id: 3,
                titulo: "Vacinação Solidária",
                descricaoBreve: "Contribua para a campanha de vacinação anual.",
                imagemUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
                seguindo: false
            }
        ];

        const campaignsListDiv = document.getElementById('campaignsList');
        campaignsListDiv.innerHTML = ''; // Clear existing mockups from HTML

        if (campaigns.length === 0) {
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
                    <p class="campaign-card-description">${campaign.descricaoBreve}</p>
                    <div class="campaign-card-actions">
                        <button class="icon-button" aria-label="Curtir"><i class="fas fa-heart"></i></button>
                        <button class="icon-button" aria-label="Comentar"><i class="fas fa-comment"></i></button>
                        <button class="btn-follow-campaign" data-campaign-id="${campaign.id}">${campaign.seguindo ? 'Seguindo' : 'Seguir'}</button>
                        <button class="icon-button" aria-label="Compartilhar"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
            `;
            // Add event listeners for campaign card buttons if needed
            // card.querySelector('.btn-follow-campaign').addEventListener('click', () => toggleFollowCampaign(campaign.id));
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