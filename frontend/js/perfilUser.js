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
  fetchUserData();
  fetchParticipatedCampaigns();
  fetchFollowedCampaigns();

  document.getElementById('editProfileBtn').onclick        = abrirModal;
  document.getElementById('closeModal').onclick             = fecharModal;
  document.getElementById('cancelModal').onclick            = fecharModal;
  document.getElementById('manageCampaignsBtn').onclick     = () => window.location.href = 'inicioAdm.html';
  document.getElementById('profileForm').onsubmit           = e => { e.preventDefault(); updateUser(); };
  document.getElementById('closeModalSenha').onclick        = fecharModalSenha;
  document.getElementById('passwordForm').onsubmit          = e => { e.preventDefault(); updatePassword(); };
  document.getElementById('confirmPasswordForm').onsubmit   = e => { e.preventDefault(); updateUserWithPassword(); };
  document.getElementById('closeModalConfirmSenha').onclick = fecharModalConfirmSenha;
  document.getElementById('inputAvatar').onchange           = previewProfileImage;
});

async function fetchUserData() {
  try {
    const res  = await fetch(`${API_BASE}/usuarios/${userId}`, { headers: authHeaders(false) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const end  = data.idEndereco || {};

    document.getElementById('inputEnderecoId').value = end.id || '';

    document.getElementById('userName').textContent      = data.nome || '';
    document.getElementById('userEmail').textContent     = data.email || '';
    document.getElementById('userCityState').textContent = [end.cidade, end.uf || end.estado].filter(Boolean).join(', ');

    if (data.midia) {
      const src = `data:${data.midiaContentType};base64,${data.midia}`;
      document.getElementById('profileImg').src    = src;
      document.getElementById('avatarIcon').src     = src;
    }

    document.getElementById('inputCpf').value         = data.cpfOuCnpj || '';
    document.getElementById('inputEmail').value       = data.email     || '';
    document.getElementById('inputName').value        = data.nome      || '';
    document.getElementById('inputLogradouro').value  = end.logradouro || '';
    document.getElementById('inputNumero').value      = end.numero     || '';
    document.getElementById('inputBairro').value      = end.bairro     || '';
    document.getElementById('inputComplemento').value = end.complemento|| '';
    document.getElementById('inputCep').value         = end.cep        || '';
    document.getElementById('inputCidade').value      = end.cidade     || '';
    document.getElementById('inputUf').value          = end.uf || end.estado || '';
  } catch (err) {
    console.error('Erro fetchUserData:', err);
    alert('Não foi possível carregar dados do usuário. Veja console.');
  }
}

async function fetchParticipatedCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/participacao/byIdUsuario/${userId}`, { headers: authHeaders(false) });
    if (!res.ok) return;
    const list = await res.json();
    const ul   = document.getElementById('donatedCampaigns');
    ul.innerHTML = '';
    list.forEach(p => {
      const li = document.createElement('li');
      li.className = 'campanha-card';
      li.innerHTML = `<h4>${p.tituloCampanha}</h4><p>${new Date(p.dataHoraParticipacao).toLocaleDateString()}</p>`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Erro fetchParticipatedCampaigns:', err);
  }
}

async function fetchFollowedCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/usuarios/${userId}/campanhas-seguidas`, { headers: authHeaders(false) });
    if (!res.ok) return;
    const list = await res.json();
    const ul   = document.getElementById('followedCampaigns');
    ul.innerHTML = '';

    list.forEach(camp => {
      const rawStart = camp.dtInicio;
      const rawEnd   = camp.dt_fim;

      const startDate = rawStart
        ? new Date(rawStart).toLocaleDateString()
        : '(sem data de início)';
      const endDate = rawEnd
        ? new Date(rawEnd).toLocaleDateString()
        : '';

      const li = document.createElement('li');
      li.className = 'campanha-card';
      li.innerHTML = `
        <h4>${camp.titulo}</h4>
        <p>${startDate}${endDate ? ' – ' + endDate : ''}</p>
      `;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Erro fetchFollowedCampaigns:', err);
  }
}

function abrirModal() {
  document.getElementById('modal').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function fecharModal() {
  document.getElementById('modal').classList.remove('show');
  document.body.style.overflow = 'auto';
}
function abrirModalSenha() {
  document.getElementById('modalSenha').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function fecharModalSenha() {
  document.getElementById('modalSenha').classList.remove('show');
  document.body.style.overflow = 'auto';
}
function abrirModalConfirmSenha() {
  document.getElementById('modalConfirmSenha').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function fecharModalConfirmSenha() {
  document.getElementById('modalConfirmSenha').classList.remove('show');
  document.body.style.overflow = 'auto';
}

function previewProfileImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  document.getElementById('avatarIcon').src = url;
  document.getElementById('profileImg').src  = url;
}

function updateUser() {
  abrirModalConfirmSenha();
}

async function updateUserWithPassword() {
  const senha = document.getElementById('inputConfirmSenha').value;
  if (!senha) return;

  const userDto = {
    nome:        document.getElementById('inputName').value,
    email:       document.getElementById('inputEmail').value,
    cpfOuCnpj:   document.getElementById('inputCpf').value,
    tipoUsuario: usuario.tipoUsuario,
    endereco: {
      id:          document.getElementById('inputEnderecoId').value,
      logradouro:  document.getElementById('inputLogradouro').value,
      numero:      document.getElementById('inputNumero').value,
      bairro:      document.getElementById('inputBairro').value,
      complemento: document.getElementById('inputComplemento').value,
      cep:         document.getElementById('inputCep').value,
      cidade:      document.getElementById('inputCidade').value,
      estado:      document.getElementById('inputUf').value
    },
    password: senha
  };

  const formData = new FormData();
  formData.append('user', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));
  const avatar = document.getElementById('inputAvatar');
  if (avatar.files.length) formData.append('midia', avatar.files[0]);

  try {
    const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) {
      alert(`Erro ${res.status}: ${res.statusText}`);
      return;
    }
    fecharModalConfirmSenha();
    fecharModal();
    fetchUserData();
  } catch (err) {
    console.error('Erro updateUserWithPassword:', err);
    alert('Erro na atualização de perfil.');
  }
}

async function updatePassword() {
  const oldPassword = document.getElementById('inputOldPass').value;
  const newPassword = document.getElementById('inputNewPass').value;
  try {
    const res = await fetch(`${API_BASE}/usuarios/alterarSenha/${userId}`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!res.ok) {
      alert(`Erro ${res.status}: ${res.statusText}`);
    } else {
      fecharModalSenha();
      alert('Senha alterada com sucesso!');
    }
  } catch (err) {
    console.error('Erro updatePassword:', err);
    alert('Erro na troca de senha.');
  }
}
