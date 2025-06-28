document.addEventListener('DOMContentLoaded', () => {
    function getIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }
    const idUsuario = getIdFromUrl();
    fetchInstitutionDetails(idUsuario);
    fetchInstitutionCampaigns(idUsuario);

    document.querySelector('.back-button').addEventListener('click', function (e) {
    e.preventDefault();
    window.history.back();
});
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

/*async function fetchInstitutionCampaigns(idUsuario) {
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
            card.style.cursor = "pointer";
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-follow-campaign')) return;
                window.location.href = `ComentariosDetalhes.html?id=${campaign.id}`;
            });

            
            const followBtn = card.querySelector('.btn-follow-campaign');
            followBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); 
                try {
                    const response = await fetch(`http://localhost:8080/campanhas/${campaign.id}/seguir`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        
                    });
                    if (response.ok) {
                        followBtn.textContent = 'Seguindo';
                        followBtn.disabled = true;
                    } else {
                        alert('Erro ao seguir campanha.');
                    }
                } catch {
                    alert('Erro ao seguir campanha.');
                }
            });

            campaignsListDiv.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
    }
} */

// caso o filtro nao de certo
async function fetchInstitutionCampaigns(idUsuario) {
    try {
        // Busca o usuário para pegar o email
        const userResponse = await fetch(`http://localhost:8080/usuarios/${idUsuario}`);
        if (!userResponse.ok) throw new Error('Erro ao buscar dados da instituição.');
        const userData = await userResponse.json();
        const userEmail = userData.email;

        // Busca campanhas filtrando pelo email do usuário
        const response = await fetch(`http://localhost:8080/campanhas?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) throw new Error('Network response was not ok for campaigns.');
        const campaigns = await response.json();

        const campaignsListDiv = document.getElementById('campaignsList');
        campaignsListDiv.innerHTML = '';

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            campaignsListDiv.innerHTML = '<p>Nenhuma campanha registrada.</p>';
            return;
        }

        campaigns.forEach(async campaign => {
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
            card.style.cursor = "pointer";
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-follow-campaign')) return;
                window.location.href = `ComentariosDetalhes.html?id=${campaign.id}`;
            });

            const followBtn = card.querySelector('.btn-follow-campaign');
            // Verifica se já está seguindo
            let isFollowing = false;
            try {
                // Substitua pelo seu método de autenticação para pegar o id do usuário logado
                const userId = localStorage.getItem('userId');
                const statusResp = await fetch(`http://localhost:8080/campanhas/${campaign.id}/esta-seguindo?userId=${userId}`);
                if (statusResp.ok) {
                    isFollowing = await statusResp.json();
                }
            } catch { }
            updateFollowButton(followBtn, isFollowing);

            followBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const userId = localStorage.getItem('userId');
                if (followBtn.dataset.following === "true") {
                    // Parar de seguir
                    try {
                        const response = await fetch(`http://localhost:8080/campanhas/${campaign.id}/parar-seguir?userId=${userId}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (response.ok) {
                            updateFollowButton(followBtn, false);
                        } else {
                            alert('Erro ao parar de seguir.');
                        }
                    } catch {
                        alert('Erro ao parar de seguir.');
                    }
                } else {
                    // Seguir
                    try {
                        const response = await fetch(`http://localhost:8080/campanhas/${campaign.id}/seguir`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: Number(userId), campanhaId: Number(campaign.id) })
                        });
                        if (response.ok) {
                            updateFollowButton(followBtn, true);
                        } else {
                            alert('Erro ao seguir campanha.');
                        }
                    } catch {
                        alert('Erro ao seguir campanha.');
                    }
                }
            });

            campaignsListDiv.appendChild(card);
        });

        // Função para atualizar o botão
        function updateFollowButton(btn, isFollowing) {
            if (isFollowing) {
                btn.textContent = 'Parar de seguir';
                btn.dataset.following = "true";
            } else {
                btn.textContent = 'Seguir';
                btn.dataset.following = "false";
            }
        }

    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
    }
} 