// Abre modal de edição
function abrirModalInstitution() {
  const m = document.getElementById('modalInstitution');
  m.classList.add('show');
  document.body.classList.add('modal-ativa');
}

// Fecha modal de edição
function fecharModalInstitution() {
  const m = document.getElementById('modalInstitution');
  m.classList.remove('show');
  document.body.classList.remove('modal-ativa');
}

// Fecha clicando fora do content
window.addEventListener('click', (e) => {
  const m = document.getElementById('modalInstitution');
  if (e.target === m) fecharModalInstitution();
});
