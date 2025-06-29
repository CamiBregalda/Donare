import { jwtDecode } from "./lib/jwt-decode.js";
import { fetchData } from "./lib/auth.js";

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
        const response = await fetch('http://localhost:8080/usuarios/authenticate', {
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

        const userDataResponse = await fetch(`http://localhost:8080/usuarios/email/${email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userDataResponse.ok) {
            throw new Error('Falha ao obter dados do usuário após o login.');
        }

        const userData = await userDataResponse.json();

        localStorage.setItem('usuario', JSON.stringify(userData));
        
        console.log("Dados do usuário recebidos:", userData);
        console.log("Valor de userData.tipoUsuario:", userData.tipoUsuario);
        console.log("Tipo de dado de userData.tipoUsuario:", typeof userData.tipoUsuario);

        if (userData && userData.tipoUsuario == 2) {
            console.log("Usuário tipo 2. Redirecionando para a tela de administração.");
            window.location.href = '../pages/inicioAdm.html'; 
        } else {
            console.log("Usuário tipo padrão. Redirecionando para a tela inicial.");
            window.location.href = '../pages/inicio.html';
        }

    } catch (error) {
        console.error('Erro no login:', error);
        alert('Falha no login. Verifique suas credenciais.');
    } finally {
        btnSubmit.disabled = false;
    }
});