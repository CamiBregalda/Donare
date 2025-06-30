import { fetchData } from "./lib/auth.js";


document.addEventListener('DOMContentLoaded', async () => {
    function getEmailFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('organizador');
    }
    const organizadorEmail = getEmailFromUrl();
    const token = localStorage.getItem('token');
    if (!organizadorEmail) {
        console.error("Email do organizador não informado.");

    }
    // Busca o id do usuário pelo email
    let idUsuario = null;
    try {
        const usuario = await fetchData();
        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }
        const resp = await fetch(`http://localhost:8080/usuarios/email/${encodeURIComponent(organizadorEmail)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!resp.ok) throw new Error('Erro ao buscar usuário pelo email');
        const userData = await resp.json();
        idUsuario = userData.id;
    } catch (e) {
        console.error("Erro ao buscar id do organizador:", e);
        return;
    }
    fetchInstitutionDetails(idUsuario, token);
    fetchInstitutionCampaigns(idUsuario, token);

    document.querySelector('.back-button').addEventListener('click', function (e) {
        e.preventDefault();
        window.history.back();
    });
});






async function fetchInstitutionDetails(idUsuario, token) {
    try {
        const usuario = await fetchData();
        if (!usuario) {
            console.error("Não foi possível obter os dados do usuário. A renderização será interrompida.");
            alert("Você não está autenticado! Faça login novamente.");
            window.location.href = "Login.html";
        }
        const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar dados da instituição.');
        const data = await response.json()
        console.log('Dados da instituição:', data);

        document.getElementById('institutionName').textContent = data.nome || '';
        let localizacao = '';
        if (data.idEndereco) {
            const end = data.idEndereco;
            localizacao = `${end.logradouro || ''}${end.bairro ? ', ' + end.bairro : ''}${end.cidade ? ', ' + end.cidade : ''}`;
        }
        document.getElementById('institutionLocation').textContent = localizacao;
        if (data.midia) {
            document.getElementById('institutionImage').src = `data:image/jpeg;base64,${data.midia}`;
        }
    } catch (error) {
        console.error('Erro ao carregar dados da instituição:', error);
        document.getElementById('institutionName').textContent = "Erro ao carregar dados da instituição.";
    }
}




async function fetchInstitutionCampaigns(idUsuario, token) {
    try {
        // Busca o usuário para pegar o email
        const userResponse = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!userResponse.ok) throw new Error('Erro ao buscar dados da instituição.');
        const userData = await userResponse.json();
        const userEmail = userData.email;

        // Busca campanhas filtrando pelo email do usuário (organizador)
        const response = await fetch(`http://localhost:8080/campanhas?usuario=${encodeURIComponent(userEmail)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok for campaigns.');
        const campaigns = await response.json();

        const campaignsListDiv = document.getElementById('campaignsList');
        campaignsListDiv.innerHTML = '';

        if (!Array.isArray(campaigns) || campaigns.length === 0) {
            campaignsListDiv.innerHTML = '<p>Nenhuma campanha registrada.</p>';
            return;
        }

        campaigns.forEach(async campaign => {
            console.log('ID da campanha:', campaign.id);
            console.log('Título da campanha:', idUsuario);
            // Busca a imagem da campanha
            let imgSrc = 'https://via.placeholder.com/300x200?text=Campanha';
            try {
                const imgResp = await fetch(`http://localhost:8080/campanhas/${campaign.id}/imagem`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (imgResp.ok) {
                    const blob = await imgResp.blob();
                    imgSrc = URL.createObjectURL(blob);
                }
            } catch (e) {

            }

            const card = document.createElement('div');
            card.className = 'campaign-card';
            card.innerHTML = `
        <div class="campaign-card-image-container">
            <img src="${imgSrc}" alt="${campaign.titulo}">
            <span class="campaign-card-title-on-image">${campaign.titulo}</span>
        </div>
        <div class="campaign-card-body">
            <p class="campaign-card-description">${campaign.descricao || ''}</p>
            <div class="campaign-card-actions">
                <button class="icon-button" aria-label="Curtir"><i class="fas fa-heart"></i></button>
                <button class="icon-button" aria-label="Comentar"><i class="fas fa-comment"></i></button>
                <button class="btn-follow-campaign" data-campaign-id="${campaign.id}">${campaign.seguindo ? 'Seguindo' : 'Seguir'}</button>
            </div>
        </div>
    `;
            card.style.cursor = "pointer";
            card.addEventListener('click', (e) => {
                // Só redireciona se NÃO for o botão de seguir
                if (e.target.classList.contains('btn-follow-campaign')) return;
                window.location.href = `ComentariosDetalhes.html?id=${campaign.id}`;
            });

            const followBtn = card.querySelector('.btn-follow-campaign');

            // Verifica se já está seguindo (opcional, depende do backend)
            let isFollowing = !!campaign.seguindo;
            updateFollowButton(followBtn, isFollowing);

            followBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                // Pega o id do usuário logado do localStorage
                const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
                if (!usuarioLogado || !usuarioLogado.id) {
                    alert("Você não está autenticado! Faça login novamente.");
                    window.location.href = "Login.html";
                    return;
                }
                const userId = usuarioLogado.id;

                if (!isFollowing) {
                    // Seguir campanha
                    try {
                        const resp = await fetch(`http://localhost:8080/usuarios/${userId}/seguir-campanha/${campaign.id}`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        if (resp.ok) {
                            isFollowing = true;
                            updateFollowButton(followBtn, true);
                        } else {
                            alert('Erro ao seguir campanha.');
                        }
                    } catch {
                        alert('Erro ao seguir campanha.');
                    }
                } else {
                    // Parar de seguir
                    try {
                        const resp = await fetch(`http://localhost:8080/usuarios/${userId}/parar-de-seguir-campanha/${campaign.id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        if (resp.ok) {
                            isFollowing = false;
                            updateFollowButton(followBtn, false);
                        } else {
                            alert('Erro ao parar de seguir.');
                        }
                    } catch {
                        alert('Erro ao parar de seguir.');
                    }
                }
            });

            function updateFollowButton(btn, following) {
                btn.textContent = following ? 'Parar de seguir' : 'Seguir';
                btn.dataset.following = following ? "true" : "false";
            }

            campaignsListDiv.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
    }
}
