;(function() {
  const API_BASE = 'http://localhost:8080';

  function authHeaders(isJson = true) {
    const token = localStorage.getItem('token') || '';
    const h = { Authorization: `Bearer ${token}` };
    if (isJson) h['Content-Type'] = 'application/json';
    return h;
  }

  async function loadGlobalHeader() {

    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;
    const fragment = await fetch('../pages/header.html').then(r => r.text());
    placeholder.innerHTML = fragment;

    const headerEl = placeholder.querySelector('header.navbar');
    if (!headerEl) return;

    const logoImg = headerEl.querySelector('.logo img');
    if (logoImg) {
      logoImg.addEventListener('click', () => {
        window.location.href = 'inicio.html';
      });
    }

    const searchInput = headerEl.querySelector('.search-bar');
    if (searchInput) {
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const q = e.target.value.trim();
          if (q) {
            window.location.href = `search.html?q=${encodeURIComponent(q)}`;
          }
        }
      });
    }

    const avatar = headerEl.querySelector('.user-avatar');
    const userId = localStorage.getItem('userId');
    const cpfOrCnpj = localStorage.getItem('cpfOuCnpj') || '';

    if (avatar && userId) {

      fetch(`${API_BASE}/usuarios/${userId}`, { headers: authHeaders(false) })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.midia) {
            avatar.src = `data:${data.midiaContentType};base64,${data.midia}`;
          }
        })
        .catch(() => {

        });

      avatar.addEventListener('click', () => {
        if (cpfOrCnpj.length === 11) {
          window.location.href = `perfilUser.html?id=${userId}`;
        } else if (cpfOrCnpj.length === 14) {
          window.location.href = `AdmPerfilInstituicao.html?id=${userId}`;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', loadGlobalHeader);
})();
