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

		const avatar = headerEl.querySelector('.user-avatar');
		const usuario = JSON.parse(localStorage.getItem('usuario'));
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

		if (avatar && usuario.id) {
			fetch(`${API_BASE}/usuarios/${usuario.id}`,
				{ headers: authHeaders(false) })
				.then(r => r.ok ? r.json() : null)
				.then(data => {
					if (data && data.midia) {
						const src = `data:${data.midiaContentType};base64,${data.midia}`;
						avatar.src = src;
					}
				})

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
				if(usuario.tipoUsuario ===2){
					destino = `AdmPerfilInstituicao.html?id=${usuario.id}`;
				} else{
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