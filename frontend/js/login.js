const API_BASE = 'http://localhost:8080';

function authHeaders(isJson = true) {
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };
    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
}

const form = document.querySelector('#form');
const btnSubmit = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    btnSubmit.disabled = true;

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const credenciais = {
        email: email,
        password: senha
    };

    try {
        const response = await fetch(`${API_BASE}/usuarios/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciais)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Erro de autenticação.');
        }

        const token = await response.text();
        localStorage.setItem('token', token);

        const userDataResponse = await fetch(`${API_BASE}/usuarios/email/${email}`, {
            headers: authHeaders(false)
        });

        if (!userDataResponse.ok) {
            throw new Error('Falha ao obter dados do usuário após o login.');
        }

        const userData = await userDataResponse.json();
        localStorage.setItem('usuario', JSON.stringify(userData));

        if (userData && userData.tipoUsuario == 2) {
            window.location.href = '../pages/inicioAdm.html'; 
        } else {
            window.location.href = '../pages/inicio.html';
        }

    } catch (error) {
        console.error('Erro no login:', error);
        alert('Falha no login. Verifique suas credenciais.');
    } finally {
        btnSubmit.disabled = false;
    }
});

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
}

window.handleCredentialResponse = function (response) {

    const googleToken = response.credential;
    const responsePayload = decodeJWT(googleToken);

    if (!responsePayload) {
        alert('Falha ao ler os dados de login do Google.');
        return;
    }

    const emailGoogle = responsePayload.email;
    const googleId = responsePayload.sub;

    const dadosParaCadastro = {
        nome: responsePayload.name,
        email: emailGoogle,
        googleId: googleId,
    };
    localStorage.setItem('cadastro_google_dados', JSON.stringify(dadosParaCadastro));

    fetch(`${API_BASE}/usuarios/authenticate/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: emailGoogle,
            googleId: googleId
        })
    })
        .then(res => {
            if (res.status === 404) {
                window.location.href = '../pages/cadastroGoogle.html';
                return null;
            }

            if (!res.ok) {
                return res.json().then(errorData => {
                    throw new Error(`Erro de autenticação com o Google. Status: ${res.status}`);
                });
            }

            return res.text();
        })
            .then(token => {
                    if (!token) return;

                    localStorage.setItem('token', token);
                    localStorage.removeItem('cadastro_google_dados');

                    fetch(`${API_BASE}/usuarios/email/${encodeURIComponent(emailGoogle)}`, {
                        headers: authHeaders(false)
                    })
                    .then(respUser => {
                        if (respUser && respUser.ok) {
                            return respUser.json();
                        }
                        return Promise.reject(new Error('Não foi possível obter dados completos do usuário'));
                    })
                    .then(fullUser => {
                        try {
                            localStorage.setItem('usuario', JSON.stringify(fullUser));
                            if (fullUser && fullUser.midia) {
                                const src = `data:${fullUser.midiaContentType};base64,${fullUser.midia}`;
                                window.dispatchEvent(new CustomEvent('user-avatar-updated', { detail: { src } }));
                            }
                            if (fullUser && fullUser.tipoUsuario == 2) {
                                window.location.href = '../pages/inicioAdm.html';
                            } else {
                                window.location.href = '../pages/inicio.html';
                            }
                        } catch (e) {
                            console.error('Erro ao processar fullUser:', e);
                            const userData = decodeJWT(token);
                            localStorage.setItem('usuario', JSON.stringify(userData));
                            if (userData && userData.tipoUsuario == 2) {
                                window.location.href = '../pages/inicioAdm.html';
                            } else {
                                window.location.href = '../pages/inicio.html';
                            }
                        }
                    })
                    .catch(err => {
                        console.warn('Fallback ao buscar usuário completo:', err);
                        try {
                            const userData = decodeJWT(token);
                            localStorage.setItem('usuario', JSON.stringify(userData));
                            if (userData && userData.tipoUsuario == 2) {
                                window.location.href = '../pages/inicioAdm.html';
                            } else {
                                window.location.href = '../pages/inicio.html';
                            }
                        } catch (e) {
                            console.error('Erro no fallback do login Google:', e);
                        }
                    });
                })
        .catch(error => {
            console.error('Erro no login com Google:', error);
            alert('Falha ao entrar com Google. Tente novamente.');
        });
};