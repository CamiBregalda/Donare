function getUserIdFromUrl() {
  return new URLSearchParams(window.location.search).get('id');
}

const API_BASE = 'http://localhost:8080';
const token = localStorage.getItem('token');
function authHeadersForm() {
  return { 'Authorization': `Bearer ${token}` };
}

function getUserId() {
  return localStorage.getItem('userId');
}

async function fetchInstitutionDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, { headers: authHeadersForm() });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();

    document.getElementById('institutionName').textContent = data.nome || '';
    document.getElementById('institutionType').textContent =
      ({ 1: 'Pessoa Física', 2: 'Abrigo de Animais', 3: 'Orfanato', 4: 'Asilo' }[data.tipoUsuario] || '');

    document.getElementById('institutionImage').src = data.midia
      ? `data:${data.midiaContentType};base64,${data.midia}`
      : 'https://via.placeholder.com/200x200?text=Instituição';

    const end = data.idEndereco || {};
    document.getElementById('institutionLocation').textContent =
      [end.logradouro, end.bairro, end.cidade].filter(Boolean).join(', ');

    document.getElementById('institutionHours').textContent = data.horarioFuncionamento || '';
    document.getElementById('institutionAcceptedDonations').textContent = data.doacoesAceitas || '';
    document.getElementById('institutionDescriptionText').textContent = data.descricao || '';

    document.getElementById('nome').value = data.nome || '';
    document.getElementById('rua').value = end.logradouro || '';
    document.getElementById('numero').value = end.numero || '';
    document.getElementById('complemento').value = end.complemento || '';
    document.getElementById('bairro').value = end.bairro || '';
    document.getElementById('cidade').value = end.cidade || '';
    document.getElementById('uf').value = end.uf || '';
    document.getElementById('cep').value = end.cep || '';
    document.getElementById('horario').value = data.horarioFuncionamento || '';
    document.getElementById('descricao').value = data.descricao || '';
    document.getElementById('preview').src = data.midia
      ? `data:${data.midiaContentType};base64,${data.midia}` : '';

    const tipos = (data.doacoesAceitas || '').split(',').map(x => x.trim());
    document.querySelectorAll('#custom-multiselect input[type="checkbox"]')
      .forEach(cb => cb.checked = tipos.includes(cb.value));
    atualizarTagsSelecionadas();

    const rev = { 'Abrigo de Animais': 2, 'Orfanato': 3, 'Asilo': 4 };
    document.getElementById('tipoInst').value = Object.keys(rev)
      .find(k => rev[k] === data.tipoUsuario) || 'Abrigo de Animais';

  } catch (e) {
    console.error(e);
    alert('Erro ao carregar dados da instituição.');
  }
}

async function fetchInstitutionCampaigns(id) {
  try {
    const res = await fetch(`${API_BASE}/campanhas?usuario=${id}`, { headers: authHeadersForm() });
    if (!res.ok) throw new Error();
    const camps = await res.json();

    const html = camps.map(c => `
      <div class="campaign-card">
        <div class="campaign-card-image-container">
          <img src="${c.imagemCapa
        ? `data:image/jpeg;base64,${c.imagemCapa}`
        : 'https://via.placeholder.com/300x200'}" />
          <span class="campaign-card-title-on-image">${c.titulo}</span>
        </div>
        <div class="campaign-card-body">
          <p class="campaign-card-description">${c.descricao || ''}</p>
          <div class="campaign-card-actions">
            <button class="btn-follow-campaign" data-campanha-id="${c.id}">Editar</button>
          </div>
        </div>
      </div>
    `).join('');

    document.getElementById('campaignsList').innerHTML = html;

    document.querySelectorAll('.btn-follow-campaign').forEach(btn => {
      btn.onclick = function () {
        const campanhaId = this.getAttribute('data-campanha-id');

        window.location.href = `CampanhaAdm.html?id=${campanhaId}`;
      };
    });
  } catch {
    document.getElementById('campaignsList').innerHTML = '<p>Erro ao carregar campanhas.</p>';
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

window.previewImage = e => {
  const f = e.target.files[0];
  if (f) document.getElementById('preview').src = URL.createObjectURL(f);
};

function setupCustomMultiselect() {
  const m = document.getElementById('custom-multiselect');
  m.querySelector('i.fa-chevron-down')
    .addEventListener('click', () => m.querySelector('.options-list').classList.toggle('show'));
  m.querySelectorAll('input[type="checkbox"]')
    .forEach(cb => cb.addEventListener('change', atualizarTagsSelecionadas));
  atualizarTagsSelecionadas();
}
function atualizarTagsSelecionadas() {
  const m = document.getElementById('custom-multiselect');
  const sel = m.querySelector('.selected-tags');
  sel.innerHTML = '';
  m.querySelectorAll('input:checked').forEach(cb => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.dataset.value = cb.value;
    span.innerHTML = `${cb.value} <span class="tag-close">&times;</span>`;
    sel.appendChild(span);
  });
  sel.querySelectorAll('.tag-close').forEach(x => x.addEventListener('click', e => {
    const v = e.target.parentNode.dataset.value;
    m.querySelector(`input[value="${v}"]`).checked = false;
    atualizarTagsSelecionadas();
  }));
}

function setupTimePicker() {
  const btn = document.getElementById('btn-open-timepicker');
  const pop = document.getElementById('timepicker-popup');
  const s = document.getElementById('time-start');
  const e = document.getElementById('time-end');
  const i = document.getElementById('horario');
  const ok = document.getElementById('btn-apply-time');
  btn.addEventListener('click', () => pop.classList.toggle('show'));
  ok.addEventListener('click', () => {
    i.value = `${s.value} - ${e.value}`;
    pop.classList.remove('show');
  });
}

async function updateInstitution(evt) {
  evt.preventDefault();
  const id = getUserId();
  const form = new FormData();

  const dto = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    cpfOuCnpj: document.getElementById('cpfOuCnpj').value,
    tipoUsuario: ({ 'Abrigo de Animais': 2, 'Orfanato': 3, 'Asilo': 4 }[document.getElementById('tipoInst').value] || 2),
    password: '',
    horarioFuncionamento: document.getElementById('horario').value,
    descricao: document.getElementById('descricao').value,
    doacoesAceitas: Array.from(
      document.querySelectorAll('#custom-multiselect input:checked')
    ).map(cb => cb.value).join(','),
    endereco: {
      logradouro: document.getElementById('rua').value,
      numero: document.getElementById('numero').value,
      complemento: document.getElementById('complemento').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      uf: document.getElementById('uf').value,
      cep: document.getElementById('cep').value
    }
  };

  form.append('user', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
  const file = document.getElementById('imagem').files[0];
  if (file) form.append('midia', file);

  const res = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: 'PUT',
    headers: authHeadersForm(),
    body: form
  });
  if (!res.ok) {
    console.error('Erro ao atualizar:', res.status);
    return alert('Falha ao atualizar dados.');
  }

  alert('Dados atualizados com sucesso!');
  fecharModalInstitution();
  fetchInstitutionDetails(id);
  fetchInstitutionCampaigns(id);
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getUserId();
  if (!id) return alert('ID do usuário não encontrado!');
  fetchInstitutionDetails(id);
  fetchInstitutionCampaigns(id);
  document.getElementById('institutionEditForm')
    .addEventListener('submit', updateInstitution);
  setupCustomMultiselect();
  setupTimePicker();

  const btnEdit = document.getElementById('btnEditInstitution');
  if (btnEdit) btnEdit.onclick = abrirModalInstitution;
});
