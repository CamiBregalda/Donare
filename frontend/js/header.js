(function () {
	const API_BASE = 'http://localhost:8080';

	function authHeaders(isJson = true) {
		const token = localStorage.getItem('authToken') || '';
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
			console.log("Header carregado com sucesso.");
		} catch (error) {
			console.error("Erro ao carregar o header.html:", error);
			return;
		}

		const headerEl = placeholder.querySelector('header.navbar');
		if (!headerEl) return;

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
				}
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
		const usuario = JSON.parse(localStorage.getItem('usuario'));
		const userId = usuario.id;


		if (avatar && usuario.id) {
			fetch(`${API_BASE}/usuarios/${usuario.id}`,
				{ headers: authHeaders(false) })
				.then(r => r.ok ? r.json() : null)
				.then(data => {
					if (data && data.midia) {
						avatar.src = `data:${data.midiaContentType};base64,${data.midia}`;
					}
				})

			const dropdown = placeholder.querySelector('.dropdown');

			avatar.addEventListener('click', (e) => {
				e.stopPropagation();
				if (dropdown) {
					dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
					console.log('Avatar clicado');
				}
			});

			document.addEventListener('click', (e) => {
				if (!dropdown) return;
				const clickedInsideAvatar = avatar.contains(e.target);
				const clickedInsideDropdown = dropdown.contains(e.target);

				if (!clickedInsideAvatar && !clickedInsideDropdown) {
					dropdown.style.display = 'none';
					console.log('Clique fora. Dropdown fechado.');
				}
			});

			const btnVerPerfil = dropdown?.querySelector('#ver-perfil');
			const btnEditarPerfil = dropdown?.querySelector('#editar-perfil');

			btnVerPerfil?.addEventListener('click', () => {
				const tipoUsuario = parseInt(usuario.tipoUsuario, 10);
				let destino;
				if(usuario.tipoUsuario ===2){
					destino = `AdmPerfilInstituicao.html?id=${usuario.id}`;
				} else{
					destino = `perfilUser.html?id=${usuario.id}`;
				}
				window.location.href = destino;
			});

		} else {
			console.log("Usuário não logado ou sem ID. O avatar e o menu de perfil não serão configurados.");
			if (avatar) avatar.style.display = 'none';
		}
	}
	document.addEventListener('DOMContentLoaded', loadGlobalHeader);
})();