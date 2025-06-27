const API_BASE = 'http://localhost:8080';
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

function authHeaders(isJson = true) {
  const h = { 'Authorization': `Bearer ${token}` };
  if (isJson) h['Content-Type'] = 'application/json';
  return h;
}

function abrirModal() { document.getElementById('modal').classList.add('show'); document.body.classList.add('modal-ativa'); }
function fecharModal() { document.getElementById('modal').classList.remove('show'); document.body.classList.remove('modal-ativa'); }
function abrirModalSenha() { document.getElementById('modalSenha').classList.add('show'); document.body.classList.add('modal-ativa'); }
function fecharModalSenha() { document.getElementById('modalSenha').classList.remove('show'); document.body.classList.remove('modal-ativa'); }

window.addEventListener('click', e => {
  if (e.target.id === 'modal') fecharModal();
  if (e.target.id === 'modalSenha') fecharModalSenha();
});

window.previewProfileImage = event => {
  const [file] = event.target.files;
  if (!file) return;
  document.getElementById('avatarIcon').innerHTML =
    `<img src="${URL.createObjectURL(file)}" style="width:80px;height:80px;border-radius:50%;">`;
  document.getElementById('inputFoto').value = '';
};

async function fetchUserData(userId) {
  try {
    const resp = await fetch(`${API_BASE}/usuarios/${userId}`, {
      headers: authHeaders(false)
    });
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const data = await resp.json();

    document.getElementById('userName').textContent = data.nome || '';
    document.getElementById('userEmail').textContent = data.email || '';
    document.getElementById('userCityState').textContent =
      `${data.idEndereco?.cidade || ''}${data.idEndereco?.estado ? ', ' + data.idEndereco.estado : ''}`;

    const imgEl = document.getElementById('profileImg');
    if (data.midia) {
      imgEl.src = `data:${data.midiaContentType};base64,${data.midia}`;
      document.getElementById('avatarIcon').innerHTML =
        `<img src="${imgEl.src}" style="width:80px;height:80px;border-radius:50%;">`;
    } else {
      imgEl.src = '../img/cachorro.jpg';
    }

    document.getElementById('nome').value = data.nome || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('cpfOuCnpj').value = data.cpfOuCnpj || '';
    document.getElementById('logradouro').value = data.idEndereco?.logradouro || '';
    document.getElementById('numero').value = data.idEndereco?.numero || '';
    document.getElementById('bairro').value = data.idEndereco?.bairro || '';
    document.getElementById('complemento').value = data.idEndereco?.complemento || '';
    document.getElementById('cep').value = data.idEndereco?.cep || '';
    document.getElementById('cidade').value = data.idEndereco?.cidade || '';
    document.getElementById('estado').value = data.idEndereco?.estado || '';
  } catch (err) {
    console.error('fetchUserData error:', err);
    alert('Erro ao carregar dados do usuário.');
  }
}

async function updateUser(userId) {
  const formData = new FormData();
  const userDto = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpfOuCnpj: document.getElementById('cpfOuCnpj').value,
    tipoUsuario: 1,
    password: '',
    endereco: {
      logradouro: document.getElementById('logradouro').value,
      bairro: document.getElementById('bairro').value,
      numero: document.getElementById('numero').value,
      cidade: document.getElementById('cidade').value,
      uf: document.getElementById('estado').value,
      cep: document.getElementById('cep').value
    }
  };
  formData.append('user', new Blob([JSON.stringify(userDto)], { type: 'application/json' }));

  const fileInput = document.getElementById('inputFoto');
  if (fileInput.files.length) {
    formData.append('midia', fileInput.files[0]);
  }

  const resp = await fetch(`${API_BASE}/usuarios/${userId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  if (!resp.ok) {
    let errBody = null;
    try { errBody = await resp.json() } catch { }
    console.error('updateUser error body:', errBody);
    alert(`Erro ao atualizar: ${errBody?.message || resp.status}`);
    return;
  }

  alert('Perfil atualizado com sucesso!');
  fecharModal();
  await fetchUserData(userId);
}

async function changePassword(userId) {
  const payload = {
    oldPassword: document.getElementById('senhaAtual').value,
    newPassword: document.getElementById('senhaNova').value
  };

  try {
    const resp = await fetch(`${API_BASE}/usuarios/alterarSenha/${userId}`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      let errBody = null;
      try { errBody = await resp.json() } catch { }
      throw new Error(errBody?.message || `Status ${resp.status}`);
    }

    alert('Senha alterada com sucesso!');
    fecharModalSenha();
    document.getElementById('senhaAtual').value = '';
    document.getElementById('senhaNova').value = '';
  } catch (err) {
    console.error('changePassword error:', err);
    alert(`Falha ao trocar senha: ${err.message}`);
  }
}

async function fetchParticipatedCampaigns(userId) {
  const resp = await fetch(`${API_BASE}/participacao/byIdUsuario/${userId}`, {
    headers: authHeaders(false)
  });
  const ul = document.getElementById('donatedCampaigns');
  if (!resp.ok) {
    ul.innerHTML = `<li class="empty-card">Você não participou de nenhuma campanha</li>`;
    return;
  }
  const list = await resp.json();
  if (!list.length) {
    ul.innerHTML = `<li class="empty-card">Você não participou de nenhuma campanha</li>`;
  } else {
    ul.innerHTML = list.map(c => `
      <li class="campanha-card">
        <strong>${c.titulo}</strong>
        <p>${new Date(c.dtInicio).toLocaleDateString()} – ${new Date(c.dt_fim).toLocaleDateString()}</p>
      </li>
    `).join('');
  }
}

async function fetchFollowedCampaigns(userId) {
  const resp = await fetch(`${API_BASE}/usuarios/${userId}/campanhas-seguidas`, {
    headers: authHeaders(false)
  });
  const ul = document.getElementById('followedCampaigns');
  if (!resp.ok) {
    ul.innerHTML = `<li class="empty-card">Você ainda não segue nenhuma campanha</li>`;
    return;
  }
  const list = await resp.json();
  if (!list.length) {
    ul.innerHTML = `<li class="empty-card">Você ainda não segue nenhuma campanha</li>`;
  } else {
    ul.innerHTML = list.map(c => `
      <li class="campanha-card">
        <strong>${c.titulo}</strong>
        <p>${new Date(c.dtInicio).toLocaleDateString()} – ${new Date(c.dt_fim).toLocaleDateString()}</p>
      </li>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!token || !userId) {
    alert('Usuário não autenticado.');
    return;
  }

  fetchUserData(userId);
  fetchParticipatedCampaigns(userId);
  fetchFollowedCampaigns(userId);

  document.getElementById('editProfileForm')
    .addEventListener('submit', e => {
      e.preventDefault();
      updateUser(userId);
    });

  document.getElementById('formAlterarSenha')
    .addEventListener('submit', e => {
      e.preventDefault();
      changePassword(userId);
    });
});

function goToCampanhaAdm() {
  window.location.href = `CampanhaAdm.html?id=${userId}`;
}
window.goToCampanhaAdm = goToCampanhaAdm;
