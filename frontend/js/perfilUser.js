const usuario  = JSON.parse(localStorage.getItem('usuario') || '{}');
const userId   = usuario.id;
const token = localStorage.getItem('token') || '';
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
  fetchFollowedCampaigns();

  document.getElementById('editProfileBtn').onclick         = abrirModal;
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
      document.getElementById('profileImg').src = src;
      document.getElementById('avatarIcon').src = src;
      window.dispatchEvent(new CustomEvent('user-avatar-updated', { detail: { src } }));
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
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = `../pages/ComentariosDetalhes.html?id=${camp.id}`;
      });
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
  let usuarioAtual = {};
  try {
    usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
  } catch (e) {
    console.warn('abrirModalSenha: erro ao ler usuario do localStorage', e);
  }

  try {
    const oldInput = document.getElementById('inputOldPass');
    const oldLabel = document.querySelector('label[for="inputOldPass"]');
    const wrapper = oldInput ? (oldInput.closest('.form-group') || oldInput.parentElement) : null;

    const hasSenha = !(usuarioAtual && usuarioAtual.contemSenha === false);
    const modalSenha = document.getElementById('modalSenha');

    // quando o usuário NÃO tem senha, adicionamos a classe 'single' para ajustar o layout
    if (!hasSenha) {
      modalSenha.classList.add('single');
    } else {
      modalSenha.classList.remove('single');
    }

    if (!hasSenha) {
      if (oldInput) { oldInput.value = ''; oldInput.disabled = true; oldInput.style.display = 'none'; }
      if (oldLabel)  oldLabel.style.display = 'none';
      if (!oldLabel && wrapper) wrapper.style.display = 'none';
    } else {
      if (oldInput) { oldInput.disabled = false; oldInput.style.display = ''; }
      if (oldLabel)  oldLabel.style.display = '';
      if (!oldLabel && wrapper) wrapper.style.display = '';
    }
  } catch (e) {
    console.warn('abrirModalSenha: não foi possível ajustar visibilidade do campo de senha antiga', e);
  }
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
  window.dispatchEvent(new CustomEvent('user-avatar-updated', { detail: { src: url } }));
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
      let bodyText = '';
      let bodyJson = null;
      try {
        const contentType = res.headers.get('content-type') || '';
        bodyText = await res.text();
        if (contentType.includes('application/json') && bodyText) {
          try 
          { bodyJson = JSON.parse(bodyText); } 
          catch(e) {

           }
        }
      } catch (e) {
        console.warn('Não foi possível ler o corpo da resposta de erro', e);
      }

      console.error('Erro ao atualizar usuário', { status: res.status, statusText: res.statusText, body: bodyJson || bodyText, userDto, usuario });

      if (usuario && usuario.contemSenha === false) {
        alert('Adicione uma senha primeiro');
      } else {
        const serverMessage = (bodyJson && (bodyJson.message || bodyJson.mensagem)) || bodyText || res.statusText || (`Erro HTTP ${res.status}`);
        alert(serverMessage);
      }
      return;
    }
    fecharModalConfirmSenha();
    fecharModal();

    const avatar = document.getElementById('inputAvatar');
    if (avatar.files.length) {
      const url = URL.createObjectURL(avatar.files[0]);
      window.dispatchEvent(new CustomEvent('user-avatar-updated', { detail: { src: url } }));
    }

    fetchUserData();
  } catch (err) {
    console.error('Erro updateUserWithPassword:', err);
    alert('Erro na atualização de perfil.');
  }
}

async function updatePassword() {
  const oldPassword = document.getElementById('inputOldPass') ? document.getElementById('inputOldPass').value : '';
  const newPassword = document.getElementById('inputNewPass').value;

  if (!newPassword) {
    alert('Informe a nova senha.');
    return;
  }
  const payload = (usuario && usuario.contemSenha === false)
    ? { newPassword }
    : { oldPassword, newPassword };

  try {
    const res = await fetch(`${API_BASE}/usuarios/alterarSenha/${userId}`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      alert(`Erro ao Atualizar senha`);
    } else {

      try {
        if (usuario && usuario.contemSenha === false) {
          usuario.contemSenha = true;
          localStorage.setItem('usuario', JSON.stringify(usuario));
        }
      } catch (e) {
        console.warn('updatePassword: não foi possível atualizar localStorage.usuario', e);
      }

      fecharModalSenha();
      alert('Senha alterada com sucesso!');
    }
  } catch (err) {
    console.error('Erro updatePassword:', err);
    alert('Erro na troca de senha.');
  }
}
