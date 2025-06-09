const idCampanha = 1; // Troque pelo id real da campanha

// Carrega as necessidades e dados da campanha
async function loadCampaignData() {
    try {
        const response = await fetch(`http://localhost:8080/necessidade/campanha/${idCampanha}/post`);
        if (!response.ok) throw new Error('Erro ao buscar necessidades');
        const necessidades = await response.json();

        // Preencher dados da campanha (usando o primeiro item)
        if (necessidades.length > 0) {
            const camp = necessidades[0];
            document.querySelector('.campaign-name-header').textContent = camp.campanhaTitulo || '';
            document.getElementById('campaignStartDate').textContent = camp.campanhaDtInicio ? camp.campanhaDtInicio.split('T')[0] : '';
            document.getElementById('campaignEndDate').textContent = camp.campanhaDtFim ? camp.campanhaDtFim.split('T')[0] : '';
            document.getElementById('campaignLocation').innerHTML = camp.campanhaEndereco || '';
            document.getElementById('campaignCategory').textContent = camp.campanhaCategoria || '';
            document.getElementById('campaignCertificate').textContent = camp.campanhaTipoCertificado || '';
        }

        // Renderizar barras de necessidades
        const itemList = document.querySelector('.item-list');
        if (itemList) {
            itemList.innerHTML = '';
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
                        <span class="item-arrecadado">arrecadado: ${item.quantidadeRecebida} ${item.unidadeMedida || ''}</span>
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
                        novaQtd++;
                    } else if (action === 'remove' && novaQtd > 0) {
                        novaQtd--;
                    } else {
                        return;
                    }

                    // Atualiza no backend
                    await updateNecessidade(idNecessidade, novaQtd);
                });
            });
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados da campanha!');
    }
}

// Atualiza quantidadeRecebida no backend
async function updateNecessidade(idNecessidade, novaQtd) {
    try {
        const response = await fetch(`http://localhost:8080/necessidade/necessidades/${idNecessidade}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ quantidadeRecebida: novaQtd })
        });
        if (!response.ok) throw new Error('Erro ao atualizar necessidade');
        await loadCampaignData();
    } catch (err) {
        alert('Erro ao atualizar necessidade!');
    }
}

// Chama ao carregar a página
document.addEventListener('DOMContentLoaded', loadCampaignData);