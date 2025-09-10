import { jwtDecode } from "./jwt-decode.js";

export async function fetchData() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "../pages/login.html";
            return null;
        }

        let payload;
        try {
            payload = jwtDecode(token);
        } catch (decodeError) {
            console.error("Erro ao decodificar o token JWT. O token pode ser inválido ou não é um JWT válido.", decodeError);
            localStorage.removeItem("token");
            window.location.href = "../pages/login.html";
            return null;
        }

        const email = payload.sub; 
        const response = await fetch(`http://localhost:8080/usuarios/email/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            localStorage.removeItem("token");
            throw new Error("Falha ao buscar dados do usuário.");
        }

        const userData = await response.json();
        localStorage.setItem("usuario", JSON.stringify(userData));
        console.log("Dados do usuário:", userData);
        return userData;

    } catch (err) {
        console.error("Erro ao carregar dados:", err);
        localStorage.removeItem("token");
        window.location.href = "../pages/login.html";
        return null;
    }
}
