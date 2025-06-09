    document.querySelector('lado-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const credenciais = {
        email: email,
        password: senha
    };

    try{
        const response = await fetch('//localhost:8080/usuarios/autenticate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credenciais)
        });

        if(!response.ok){
            const errorData = await response.text();
            throw new Error(errorData || 'Erro de autenticação.')
        }

        const token = await response.text();
        localStorage.setItem('authToken', token);
        alert('Login realizado com sicesso!');
        window.location.href('../pages/inicio.html')
    } catch(error){
        console.error('Erro no login:', error);
        alert('Falha no login. Verifique suas credenciais.');
    }
});