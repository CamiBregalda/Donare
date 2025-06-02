function abrirModal() {
  document.getElementById('modal').classList.add('show');
  document.body.classList.add('modal-ativa');
}

function fecharModal() {
  document.getElementById('modal').classList.remove('show');
  document.body.classList.remove('modal-ativa');
}

window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    fecharModal();
  }
};

function baixarCertificado(arquivo) {
  alert(`Simulação de download de ${arquivo}`);
}

function compartilharCertificado(certificadoId) {
  alert(`Compartilhando certificado ${certificadoId}`);
}
