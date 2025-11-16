const API_BASE = 'http://localhost:8080';

function authHeaders(isJson = true) {
	const token = localStorage.getItem('token') || '';
	const response = { Authorization: `Bearer ${token}` };
	if (isJson) response['Content-Type'] = 'application/json';
	return response;
}

async function loadGlobalHeader() {
	const placeholder = document.getElementById('header-placeholder');

	if (!placeholder) {
		console.warn("Elemento 'header-placeholder' não encontrado.");
		return;
	}

	try {
		const fragment = await fetch('../pages/header.html').then(r => r.text());
		placeholder.innerHTML = fragment;
	} catch (error) {
		console.error("Erro ao carregar o header.html:", error);
		return;
	}

	const headerEl = placeholder.querySelector('header.navbar');
	if (!headerEl) return;


	//input de busca
	const isAdm = localStorage.getItem('tipoUsuario');

	if (isAdm === '2') {
		const searchInput = headerEl.querySelector('#search-input');
		if (searchInput) searchInput.parentElement.style.display = 'none';
	} else {
		const searchInput = headerEl.querySelector('#search-input');
		const searchButton = headerEl.querySelector('#search-button');

		if (searchInput && searchButton) {
			async function executarBusca() {
				const termo = searchInput.value.trim();
				if (!termo) {
					if (typeof renderizaCampanhas === "function") {
						await renderizaCampanhas();
					} else {
						console.warn("Função renderizaCampanhas não encontrada.");
					}
					return;
				}

				try {
					const response = await fetch(
						`${API_BASE}/campanhas?titulo=${encodeURIComponent(termo)}`,
						{ headers: authHeaders(false) }
					);

					if (!response.ok) {
						throw new Error(`Erro HTTP na busca: ${response.status}`);
					}

					const campanhas = await response.json();

					const hoje = new Date();
					const campanhasAtivasBusca = campanhas.filter(c => {
						const inicio = new Date(c.dtInicio);
						const fim = new Date(c.dt_fim);
						return inicio <= hoje && fim >= hoje;
					});

					if (typeof renderizaCampanhas === "function") {
						await renderizaCampanhas(campanhasAtivasBusca);
					} else {
						console.warn("Função renderizaCampanhas não encontrada.");
					}
				} catch (error) {
					console.error("Erro ao buscar campanhas:", error);
				}
			}
			searchButton.addEventListener("click", executarBusca);
			searchInput.addEventListener("keypress", (e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					executarBusca();
				}
			});
		}
	}

	const logoImg = headerEl.querySelector('.logo img');
	if (logoImg) {
		logoImg.addEventListener('click', () => {
			const usuario = JSON.parse(localStorage.getItem('usuario'));

			if (usuario && usuario.tipoUsuario) {
				const tipoUsuario = parseInt(usuario.tipoUsuario, 10);
				if (tipoUsuario == 2) {
					window.location.href = "inicioAdm.html"
				} else {
					window.location.href = 'inicio.html';
				}

				const paginaAtual = window.location.pathname.split('/').pop();
				if (paginaAtual === destino) {
					return;
				}
			}
		});
	}

	const avatar = headerEl.querySelector('.user-avatar');
	const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
	const userId = usuario.id;

		// Expor função global e ouvir evento para atualização imediata do avatar no header
		window.updateHeaderAvatar = (src) => {
			if (avatar && src) avatar.src = src;
		};
		window.addEventListener('user-avatar-updated', (e) => {
			const src = e?.detail?.src;
			if (src) window.updateHeaderAvatar(src);
		});
		// Fallback: também ouve no document caso algum código dispare por lá
		document.addEventListener('user-avatar-updated', (e) => {
			const src = e?.detail?.src;
			if (src) window.updateHeaderAvatar(src);
		});

	if (avatar && userId) {

		try {

			const response = await fetch(`${API_BASE}/usuarios/${userId}`,
				{ headers: authHeaders(false) })

			if (response.ok) {
				const data = await response.json();
				if (data && data.midia) {
					avatar.src = `data:${data.midiaContentType};base64,${data.midia}`;
				}
			}
		} catch (error) {
			console.error('falha na busca de imagem de usuário')
			avatar.src = '../img/user.png';
		}

		const dropdown = placeholder.querySelector('.dropdown');

		avatar.addEventListener('click', (e) => {
			e.stopPropagation();
			if (dropdown) {
				dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
			}
		});

		document.addEventListener('click', (e) => {
			if (!dropdown) return;
			const clickedInsideAvatar = avatar.contains(e.target);
			const clickedInsideDropdown = dropdown.contains(e.target);

			if (!clickedInsideAvatar && !clickedInsideDropdown) {
				dropdown.style.display = 'none';
			}
		});

			const btnVerPerfil = dropdown?.querySelector('#ver-perfil');
			const btnEditarPerfil = dropdown?.querySelector('#editar-perfil');
			let btnLogout = dropdown?.querySelector('#logout'); // <— era const, precisa ser let

		btnVerPerfil?.addEventListener('click', () => {
			const tipoUsuario = parseInt(usuario.tipoUsuario, 10);
			let destino;
			if (usuario.tipoUsuario === 2) {
				destino = `AdmPerfilInstituicao.html?id=${usuario.id}`;
			} else {
				destino = `perfilUser.html?id=${usuario.id}`;
			}
			window.location.href = destino;
		});

		if (!btnLogout) {
			btnLogout = document.createElement('button');
			btnLogout.id = 'logout';
			btnLogout.textContent = 'Logout';

			dropdown?.appendChild(btnLogout);
		}
		btnLogout.addEventListener('click', () => {
			localStorage.removeItem('token');
			localStorage.removeItem('usuario');
			window.location.href = 'login.html';
		});


	} else {
		if (avatar) avatar.style.display = 'none';
	}
}
document.addEventListener('DOMContentLoaded', loadGlobalHeader);