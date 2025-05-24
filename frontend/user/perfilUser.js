function abrirModal() {
  document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

function baixarCertificado(arquivo) {
  alert(`Simulação de download de ${arquivo}`);
}

function compartilharCertificado(certificadoId) {
  alert(`Compartilhando certificado ${certificadoId}`);
}

document.getElementById('modal').classList.add('show');

