// AdmPerfilInstituicao.js

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

  document.getElementById('btnEditInstitution').addEventListener('click', abrirModalInstitution);
  document.getElementById('institutionEditForm').addEventListener('submit', e => {
    e.preventDefault();
    abrirModalSenha();
  });
  document.getElementById('senhaConfirmForm').addEventListener('submit', async e => {
    e.preventDefault();
    await confirmUpdate();
  });

  // handlers do novo modal de alterar senha
  document.getElementById('btnChangePassword').addEventListener('click', abrirModalChangePassword);
  document.getElementById('closeChangePasswordModal').addEventListener('click', fecharModalChangePassword);
  document.getElementById('changePasswordForm').addEventListener('submit', async e => {
    e.preventDefault();
    await updatePassword();
  });
});

async function fetchInstitutionDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, { headers: authHeaders(false) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    document.getElementById('institutionName').textContent = data.nome || '';
    if (data.midia) {
      const src = `data:${data.midiaContentType};base64,${data.midia}`;
      document.getElementById('institutionImage').src = src;
      document.getElementById('preview').src          = src;
    }

    const end = data.idEndereco || {};
    document.getElementById('institutionLocation').textContent =
      [end.logradouro, end.bairro, end.cidade].filter(Boolean).join(', ');

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
    const { email: userEmail } = await userRes.json();

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
        // mantém placeholder
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
          <button class="btn-follow-campaign btn-edit-campaign">Editar</button>
        </div>
      `;
      card.style.cursor = 'pointer';

      // clique em qualquer lugar do card leva a ComentariosDetalhes.html
      card.addEventListener('click', () => {
        window.location.href = `ComentariosDetalhes.html?id=${campaign.id}`;
      });

      // botão de editar interrompe propagaçao e leva a CampanhaAdm
      card.querySelector('.btn-edit-campaign').addEventListener('click', e => {
        e.stopPropagation();
        window.location.href = `CampanhaAdm.html?id=${campaign.id}`;
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
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById('preview').src = URL.createObjectURL(file);
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
    window.location.reload();
  } catch (err) {
    console.error('Erro confirmUpdate:', err);
    alert('Erro ao confirmar atualização. Veja o console.');
  }
}

// === Novo modal de alterar senha ===

function abrirModalChangePassword() {
  document.getElementById('modalChangePassword').classList.add('show');
  document.body.classList.add('modal-ativa');
}
function fecharModalChangePassword() {
  document.getElementById('modalChangePassword').classList.remove('show');
  document.body.classList.remove('modal-ativa');
}
async function updatePassword() {
  const oldPassword = document.getElementById('inputOldPassword').value;
  const newPassword = document.getElementById('inputNewPassword').value;
  if (!oldPassword || !newPassword) {
    alert('Preencha as duas senhas.');
    return;
  }
  try {
    const res = await fetch(
      `${API_BASE}/usuarios/alterarSenha/${userId}`,
      {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ oldPassword, newPassword })
      }
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      alert(`Erro ${res.status}: ${errText}`);
    } else {
      alert('Senha alterada com sucesso!');
      fecharModalChangePassword();
    }
  } catch (err) {
    console.error('Erro updatePassword:', err);
    alert('Falha na troca de senha. Veja o console.');
  }
}
