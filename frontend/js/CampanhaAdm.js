const idCampanha = 2; // Troque pelo id real da campanha

// Carrega as necessidades e dados da campanha
function formatDateBr(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

async function loadCampaignData() {
    try {
        // Buscar dados da campanha
        const campResponse = await fetch(`http://localhost:8080/campanhas/${idCampanha}`);
        if (!campResponse.ok) throw new Error('Erro ao buscar dados da campanha');
        const campData = await campResponse.json();

        document.querySelector('.campaign-name-header').textContent = campData.titulo || '';
        document.getElementById('campaignStartDate').textContent = formatDateBr(campData.dt_inicio);
        document.getElementById('campaignEndDate').textContent = formatDateBr(campData.dt_fim);
        document.getElementById('campaignLocation').textContent = campData.endereco || '';
        document.getElementById('campaignCategory').textContent = campData.categoriaCampanha || '';
        document.getElementById('campaignDescriptionText').textContent = campData.descricao || '';

        // Busca imagem da campanha e coloca no local correto
        const imgResp = await fetch(`http://localhost:8080/campanhas/${idCampanha}/imagem`);
        if (imgResp.ok) {
            const blob = await imgResp.blob();
            const imgUrl = URL.createObjectURL(blob);
            const imgEl = document.querySelector('.campaign-image');
            if (imgEl) {
                imgEl.src = imgUrl;
                imgEl.alt = 'Imagem da campanha';
            }
        }

        // Buscar necessidades normalmente
        const response = await fetch(`http://localhost:8080/necessidade/campanhas/${idCampanha}/necessidades`);
        if (!response.ok) throw new Error('Erro ao buscar necessidades');
        const necessidades = await response.json();

        // Renderizar barras de necessidades
        const itemList = document.querySelector('.item-list');
        itemList.innerHTML = '';
        if (!Array.isArray(necessidades) || necessidades.length === 0) {
            itemList.innerHTML = '<p>Nenhuma necessidade cadastrada.</p>';
            return;
        }
        necessidades.forEach(item => {
            const porcentagem = item.quantidadeNecessaria > 0
                ? Math.min(100, (item.quantidadeRecebida / item.quantidadeNecessaria) * 100)
                : 0;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.nome}</span>
                    <span class="item-meta">Meta: ${item.quantidadeNecessaria} ${item.unidadeMedida || ''}</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar" style="width: ${porcentagem}%;"></div>
                </div>
                <div class="item-bottom">
                    <span class="item-arrecadado">Arrecadado: ${item.quantidadeRecebida} ${item.unidadeMedida || ''}</span>
                    <div class="adm-controls">
                        <button class="btn-add" data-id="${item.id}" data-action="add">+</button>
                        <button class="btn-remove" data-id="${item.id}" data-action="remove">-</button>
                    </div>
                </div>
            `;
            itemList.appendChild(itemDiv);
        });

        // Eventos dos botões
                itemList.querySelectorAll('.btn-add, .btn-remove').forEach(btn => {
            btn.addEventListener('click', async function () {
                const idNecessidade = this.getAttribute('data-id');
                const action = this.getAttribute('data-action');
                const necessidade = necessidades.find(n => n.id == idNecessidade);
                if (!necessidade) return;

                let novaQtd = necessidade.quantidadeRecebida;
                if (action === 'add') {
                    if (novaQtd < necessidade.quantidadeNecessaria) {
                        novaQtd++;
                    } else {
                        // Limite atingido, não permite adicionar mais
                        return;
                    }
                } else if (action === 'remove' && novaQtd > 0) {
                    novaQtd--;
                } else {
                    return;
                }

                // Atualiza no backend
                await updateNecessidade(idNecessidade, novaQtd, necessidade);
            });
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
    }
}

// Atualiza quantidadeRecebida no backend
async function updateNecessidade(idNecessidade, novaQtd, necessidade) {
    try {
        const response = await fetch(`http://localhost:8080/necessidade/necessidades/${idNecessidade}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                nome: necessidade.nome,
                quantidadeNecessaria: necessidade.quantidadeNecessaria,
                quantidadeRecebida: novaQtd,
                unidadeMedida: necessidade.unidadeMedida
            })
        });
        if (!response.ok) throw new Error('Erro ao atualizar necessidade');
        await loadCampaignData();
    } catch (err) {
        alert('Erro ao atualizar necessidade!');
    }
}

// Chama ao carregar a página
document.addEventListener('DOMContentLoaded', loadCampaignData);