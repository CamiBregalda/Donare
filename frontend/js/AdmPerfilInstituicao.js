const API_BASE = 'http://localhost:8080';
const token    = localStorage.getItem('token') || '';
const usuario  = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId   = usuario.id;

if (!token || !userId) {
  alert('Usuário não autenticado.');
  window.location.href = 'login.html';
  throw new Error('Não autenticado');
}

function authHeaders(json = true) {
  const headers = { Authorization: `Bearer ${token}` };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

document.addEventListener('DOMContentLoaded', () => {
  fetchInstitutionDetails(userId);
  fetchInstitutionCampaigns(userId);

  document
    .getElementById('btnEditInstitution')
    .addEventListener('click', abrirModalInstitution);

  document
    .getElementById('institutionEditForm')
    .addEventListener('submit', e => {
      e.preventDefault();
      abrirModalSenha();
    });

  document
    .getElementById('senhaConfirmForm')
    .addEventListener('submit', async e => {
      e.preventDefault();
      await confirmUpdate();
    });
});

async function fetchInstitutionDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, { headers: authHeaders(false) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    document.getElementById('institutionName').textContent = data.nome || '';
    document.getElementById('institutionType').textContent = {
      2: 'Abrigo de Animais',
      3: 'Orfanato',
      4: 'Asilo',
    }[data.tipoUsuario] || '';

    if (data.midia) {
      const src = `data:${data.midiaContentType};base64,${data.midia}`;
      document.getElementById('institutionImage').src = src;
      document.getElementById('preview').src          = src;
    }

    const end = data.idEndereco || {};
    const location = [end.logradouro, end.bairro, end.cidade]
      .filter(Boolean)
      .join(', ');
    document.getElementById('institutionLocation').textContent = location;

    document.getElementById('enderecoId').value  = end.id || '';
    document.getElementById('nome').value        = data.nome || '';
    document.getElementById('email').value       = data.email || '';
    document.getElementById('cpfOuCnpj').value   = data.cpfOuCnpj || '';
    document.getElementById('rua').value         = end.logradouro || '';
    document.getElementById('numero').value      = end.numero || '';
    document.getElementById('complemento').value = end.complemento || '';
    document.getElementById('bairro').value      = end.bairro || '';
    document.getElementById('cidade').value      = end.cidade || '';
    document.getElementById('estado').value      = end.estado || '';
    document.getElementById('cep').value         = end.cep || '';
  } catch (err) {
    console.error('Erro fetchInstitutionDetails:', err);
    alert('Não foi possível carregar os detalhes da instituição. Veja o console.');
  }
}

async function fetchInstitutionCampaigns(idUsuario) {
  const container = document.getElementById('campaignsList');
  container.innerHTML = '<p class="loading">Carregando campanhas...</p>';

  try {
    const userRes = await fetch(`${API_BASE}/usuarios/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!userRes.ok) throw new Error('Erro ao buscar dados da instituição.');
    const userData = await userRes.json();
    const userEmail = userData.email;

    const campsRes = await fetch(
      `${API_BASE}/campanhas?usuario=${encodeURIComponent(userEmail)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!campsRes.ok) throw new Error('Erro ao buscar campanhas.');
    const campaigns = await campsRes.json();

    container.innerHTML = '';
    if (!Array.isArray(campaigns) || campaigns.length === 0) {
      container.innerHTML = '<p>Nenhuma campanha registrada.</p>';
      return;
    }

    campaigns.forEach(async campaign => {
      let imgSrc = 'https://via.placeholder.com/300x200?text=Campanha';
      try {
        const imgResp = await fetch(
          `${API_BASE}/campanhas/${campaign.id}/imagem`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (imgResp.ok) {
          const blob = await imgResp.blob();
          imgSrc = URL.createObjectURL(blob);
        }
      } catch {
      }

      const card = document.createElement('div');
      card.className = 'campaign-card';
      card.innerHTML = `
        <div class="campaign-card-image-container">
          <img src="${imgSrc}" alt="${campaign.titulo}">
          <span class="campaign-card-title-on-image">${campaign.titulo}</span>
        </div>
        <div class="campaign-card-body">
          <button class="btn-follow-campaign btn-edit-campaign">Editar</button>
        </div>
      `;
      card.style.cursor = 'pointer';

      card.querySelector('.btn-edit-campaign').addEventListener('click', e => {
        e.stopPropagation();
        window.location.href = `inicioAdm.html?id=${campaign.id}`;
      });

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    container.innerHTML = '<p>Erro ao carregar campanhas.</p>';
  }
}

function abrirModalInstitution() {
  document.getElementById('modalInstitution').classList.add('show');
  document.body.classList.add('modal-ativa');
}
function fecharModalInstitution() {
  document.getElementById('modalInstitution').classList.remove('show');
  document.body.classList.remove('modal-ativa');
}
function abrirModalSenha() {
  fecharModalInstitution();
  document.getElementById('modalSenhaConfirm').classList.add('show');
  document.body.classList.add('modal-ativa');
}
function fecharModalSenha() {
  document.getElementById('modalSenhaConfirm').classList.remove('show');
  document.body.classList.remove('modal-ativa');
}

window.previewImage = e => {
  const f = e.target.files[0];
  if (!f) return;
  document.getElementById('preview').src = URL.createObjectURL(f);
};

async function confirmUpdate() {
  try {
    const senha = document.getElementById('senhaAtualConfirm').value;
    const dto = {
      nome:        document.getElementById('nome').value,
      email:       document.getElementById('email').value,
      cpfOuCnpj:   document.getElementById('cpfOuCnpj').value,
      tipoUsuario: usuario.tipoUsuario,
      endereco: {
        id:          +document.getElementById('enderecoId').value,
        logradouro:  document.getElementById('rua').value,
        complemento: document.getElementById('complemento').value,
        bairro:      document.getElementById('bairro').value,
        numero:      document.getElementById('numero').value,
        cidade:      document.getElementById('cidade').value,
        estado:      document.getElementById('estado').value,
        cep:         document.getElementById('cep').value
      },
      password: senha
    };

    const form = new FormData();
    form.append('user', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    const img = document.getElementById('imagem').files[0];
    if (img) form.append('midia', img);

    const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });

    if (!res.ok) {
      alert(`Erro ${res.status} ao atualizar.`);
      fecharModalSenha();
      abrirModalInstitution();
      return;
    }

    alert('Dados atualizados com sucesso!');
    fecharModalSenha();
    await fetchInstitutionCampaigns(userId);
  } catch (err) {
    console.error('Erro confirmUpdate:', err);
    alert('Erro ao confirmar atualização. Veja o console.');
  }
}
