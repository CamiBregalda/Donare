import { jwtDecode } from "./lib/jwt-decode.js";

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

        localStorage.setItem('authToken', token);

        window.location.href = '../pages/inicio.html';

    } catch (error) {
        console.error('Erro no login:', error);
        alert('Falha no login. Verifique suas credenciais.');
    } finally {
        btnSubmit.disabled = false;
    }
});

async function fetchData() {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "/login.html";
            return;
        }

        const payload = jwtDecode(token);
        const email = payload.email;

        const fetchOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(`http://localhost:8080/usuarios/email/${email}`, fetchOptions);

        if (!response.ok) {
            throw new Error("Falha ao buscar dados do usuário.");
        }

        const userData = await response.text();

        console.log("Dados do usuário:", userData);

    } catch (err) {
        console.error("Erro ao carregar dados:", err);
        alert("Erro ao carregar dados. Faça login novamente.");
        window.location.href = "/login.html";
    }
}