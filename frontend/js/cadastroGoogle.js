const API_BASE = 'http://localhost:8080';

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

document.addEventListener('DOMContentLoaded', () => {

    const googleDataString = localStorage.getItem('cadastro_google_dados');
    if (!googleDataString) {
        alert('Dados do login do Google não encontrados. Retornando ao Login.');
        window.location.href = '../pages/login.html';
        return;
    }

    const googleData = JSON.parse(googleDataString);
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);

})

async function handleFormSubmit(e) {
    e.preventDefault();

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.label-error').forEach(el => el.classList.remove('label-error'));

    const cpfCnpj = document.getElementById('cpf-cnpj').value.replace(/\D/g, '');

    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
        alert('O CPF deve conter 11 dígitos ou o CNPJ 14 dígitos.');
        document.getElementById('cpf-cnpj').classList.add('input-error');
        document.getElementById('cpf-cnpj').focus();
        return;
    }

    let tipoDocumento;
    let tipoDocumentoNome;
    if (cpfCnpj.length === 11) {
        tipoDocumento = 1;
        tipoDocumentoNome = 'CPF'
    } else {
        tipoDocumento = 2;
        tipoDocumentoNome = 'CNPJ'
    }

    const googleData = JSON.parse(localStorage.getItem('cadastro_google_dados'));

    const novoUsuario = {
        nome: googleData.nome,
        email: googleData.email,
        cpfOuCnpj: cpfCnpj,
        tipoUsuario: tipoDocumento,
        googleId: googleData.googleId
    };

    try {
        const formData = new FormData();
        formData.append('user', new Blob(
            [JSON.stringify(novoUsuario)],
            { type: "application/json" }
        ))

        const cadastroResponse = await fetch(`${API_BASE}/usuarios`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })

        const cadastroData = await cadastroResponse.json();

        if (!cadastroResponse.ok) {
            if (cadastroResponse.status === 400 && cadastroData.message) {
                if (cadastroData.message.includes('CPF') || cadastroData.message.includes('CNPJ') || cadastroData.message.includes('Documento')) {
                    alert(cadastroData.message)
                    document.getElementById('cpf-cnpj').classList.add('input-error');
                    return;
                }
            }
            throw new Error(cadastroData.message || responseBody || `Erro ${cadastroResponse.status} no cadastro`);
        }

        const authResponse = await fetch(`${API_BASE}/usuarios/authenticate/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: novoUsuario.email,
                googleId: novoUsuario.googleId
            })
        })

        if (!authResponse.ok) {
            throw new Error(`Erro de autenticação com o Google. Status: ${authResponse.status}`);
        }

        const token = await authResponse.text();

        localStorage.setItem('token', token);
        localStorage.removeItem('cadastro_google_dados');

        try {
            const respUser = await fetch(`${API_BASE}/usuarios/email/${encodeURIComponent(novoUsuario.email)}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (respUser.ok) {
                const fullUser = await respUser.json();
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
                return;
            }
        } catch (e) {
            console.error('Falha ao buscar dados completos do usuário após cadastro Google:', e);
        }

        const userData = decodeJWT(token)
        localStorage.setItem('usuario', JSON.stringify(userData));
        if (userData && userData.tipoUsuario == 2) {
            window.location.href = '../pages/inicioAdm.html';
        } else {
            window.location.href = '../pages/inicio.html';
        }

    } catch (error) {
        console.error('Erro no cadastro/autenticação:', error);
        alert('Falha ao finalizar o cadastro. Detalhes: ' + error.message);
    }
}
