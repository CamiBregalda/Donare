document.addEventListener('DOMContentLoaded', () => {
  function abrirModalInstitution() {
    document.getElementById('modalInstitution').classList.add('show');
    document.body.classList.add('modal-ativa');
  }
  function fecharModalInstitution() {
    document.getElementById('modalInstitution').classList.remove('show');
    document.body.classList.remove('modal-ativa');
  }
  window.abrirModalInstitution = abrirModalInstitution;
  window.fecharModalInstitution = fecharModalInstitution;
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalInstitution')) {
      fecharModalInstitution();
    }
  });
  window.previewImage = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(file);
    preview.alt = "Imagem selecionada";
  };
  const customMulti = document.getElementById('custom-multiselect');
  const selectedTagsContainer = customMulti.querySelector('.selected-tags');
  const optionsList = customMulti.querySelector('.options-list');
  const hiddenSelect = document.getElementById('tipos');
  customMulti.addEventListener('click', (e) => {
    const tgt = e.target;
    if (tgt.tagName.toLowerCase() === 'input' && tgt.type === 'checkbox') return;
    if (tgt.classList.contains('tag-close')) return;
    optionsList.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!customMulti.contains(e.target)) {
      optionsList.classList.remove('show');
    }
  });
  optionsList.addEventListener('change', (e) => {
    const tgt = e.target;
    if (tgt.tagName.toLowerCase() === 'input' && tgt.type === 'checkbox') {
      atualizarTagsSelecionadas();
    }
  });
  selectedTagsContainer.addEventListener('click', (e) => {
    const tgt = e.target;
    if (tgt.classList.contains('tag-close')) {
      const valor = tgt.parentElement.getAttribute('data-value');
      const checkboxParaDesmarcar = optionsList.querySelector(`input[type="checkbox"][value="${valor}"]`);
      if (checkboxParaDesmarcar) checkboxParaDesmarcar.checked = false;
      atualizarTagsSelecionadas();
    }
  });
  function atualizarTagsSelecionadas() {
    selectedTagsContainer.innerHTML = '';
    hiddenSelect.innerHTML = '';
    const checkboxes = optionsList.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        const tag = document.createElement('span');
        tag.classList.add('tag');
        tag.setAttribute('data-value', cb.value);
        tag.appendChild(document.createTextNode(cb.value));
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark', 'tag-close');
        tag.appendChild(closeIcon);
        selectedTagsContainer.appendChild(tag);
        const opt = document.createElement('option');
        opt.value = cb.value;
        opt.selected = true;
        hiddenSelect.appendChild(opt);
      }
    });
  }
  atualizarTagsSelecionadas();
  const btnOpenTimepicker = document.getElementById('btn-open-timepicker');
  const timepickerPopup = document.getElementById('timepicker-popup');
  const inputHorario = document.getElementById('horario');
  const timeStart = document.getElementById('time-start');
  const timeEnd = document.getElementById('time-end');
  const btnApplyTime = document.getElementById('btn-apply-time');
  if (btnOpenTimepicker && timepickerPopup) {
    btnOpenTimepicker.addEventListener('click', (e) => {
      e.stopPropagation();
      timepickerPopup.classList.toggle('show');
    });
    btnApplyTime.addEventListener('click', () => {
      const startVal = timeStart.value;
      const endVal = timeEnd.value;
      if (startVal && endVal) {
        inputHorario.value = `${startVal} – ${endVal}`;
      }
      timepickerPopup.classList.remove('show');
    });
    document.addEventListener('click', (e) => {
      const clicouNoPopup = timepickerPopup.contains(e.target);
      const clicouNoBotao = e.target === btnOpenTimepicker;
      if (!clicouNoPopup && !clicouNoBotao) {
        timepickerPopup.classList.remove('show');
      }
    });
    const inicial = inputHorario.value.split(' – ');
    if (inicial.length === 2) {
      timeStart.value = inicial[0].trim();
      timeEnd.value = inicial[1].trim();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const institutionId = 1;
  fetchInstitutionDetails(institutionId);
  fetchInstitutionCampaigns(institutionId);
});

async function fetchInstitutionDetails(id) {
  try {
    const data = {
      nome: "Instituição Muito Legal",

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
    console.error(error);
    document.getElementById('institutionName').textContent = "Erro ao carregar dados da instituição.";
  }
}

async function fetchInstitutionCampaigns(institutionId) {
  try {
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
    campaignsListDiv.innerHTML = '';
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
                        <button class="btn-follow-campaign" data-campaign-id="${campaign.id}">editar</button>
                    </div>
                </div>
            `;
      campaignsListDiv.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
  }
}