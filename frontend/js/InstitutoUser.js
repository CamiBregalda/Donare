document.addEventListener('DOMContentLoaded', () => {
    const idUsuario = 1; // Troque pelo ID real da instituição
    fetchInstitutionDetails(idUsuario);
    fetchInstitutionCampaigns(idUsuario);
});

async function fetchInstitutionDetails(idUsuario) {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da instituição.');
        const data = await response.json();
        console.log('Dados da instituição:', data);

        document.getElementById('institutionName').textContent = data.nome || '';
        document.getElementById('institutionType').textContent = data.tipoUsuario || '';

        // Monta localização: rua, bairro, cidade
        let localizacao = '';
        if (data.idEndereco) {
            const end = data.idEndereco;
            localizacao = `${end.logradouro || ''}${end.bairro ? ', ' + end.bairro : ''}${end.cidade ? ', ' + end.cidade : ''}`;
        }
        document.getElementById('institutionLocation').textContent = localizacao;

        // Imagem (se houver)
        if (data.midia) {
            document.getElementById('institutionImage').src = `data:image/jpeg;base64,${data.midia}`;
        }
    } catch (error) {
        console.error('Erro ao carregar dados da instituição:', error);
        document.getElementById('institutionName').textContent = "Erro ao carregar dados da instituição.";
    }
}

async function fetchInstitutionCampaigns(idUsuario) {
    try {
        // Primeiro, busque o usuário para pegar o email
        const userResponse = await fetch(`http://localhost:8080/usuarios/${idUsuario}`);
        if (!userResponse.ok) throw new Error('Erro ao buscar dados da instituição.');
        const userData = await userResponse.json();
        const userEmail = userData.email;

        // Agora busque todas as campanhas
        const response = await fetch(`http://localhost:8080/campanhas`);
        if (!response.ok) throw new Error('Network response was not ok for campaigns.');
        const campaigns = await response.json();

        const campaignsListDiv = document.getElementById('campaignsList');
        campaignsListDiv.innerHTML = '';

        // Filtra campanhas pelo email do usuário
        const userCampaigns = campaigns.filter(campaign => campaign.email === userEmail);

        if (!Array.isArray(userCampaigns) || userCampaigns.length === 0) {
            campaignsListDiv.innerHTML = '<p>Nenhuma campanha registrada.</p>';
            return;
        }

        userCampaigns.forEach(campaign => {
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