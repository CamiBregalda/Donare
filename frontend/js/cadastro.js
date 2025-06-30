document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('input-error');

            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                label.classList.remove('label-error');
            }
        });
    });

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.label-error').forEach(el => el.classList.remove('label-error'));

    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpf-cnpj').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;

    if (senha !== confirmaSenha) {
        alert('As Senhas não coincidem');
        document.getElementById('confirma-senha').classList.add('input-error');
        document.getElementById('label-confirma-senha').classList.add('label-error');
        document.getElementById('confirma-senha').focus();
        return;
    }

    if (estado.length != 2) {
        alert('Lembre-se: a Sigla possuiu dois caracteres');
        document.getElementById('estado').classList.add('input-error');
        document.getElementById('label-estado').classList.add('label-error');
        document.getElementById('estado').focus();
    }

    if (cep.length !== 8 || isNaN(cep)) {
        alert('O CEP deve conter 8 números.');
        document.getElementById('cep').classList.add('input-error');
        document.getElementById('label-cep').classList.add('label-error');
        document.getElementById('cep').focus();
        return;
    }

    let tipoDocumento;
    if (cpfCnpj.length === 11) {
        tipoDocumento = 1;
    } else {
        tipoDocumento = 2;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        cpfOuCnpj: cpfCnpj,
        tipoUsuario: tipoDocumento,
        endereco: {
            logradouro: logradouro,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            uf: estado,
            cep: cep
        },
        password: senha
    };

    console.log(novoUsuario);

    const formData = new FormData();
    formData.append('user', new Blob(
        [JSON.stringify(novoUsuario)],
        { type: "application/json" }
    ));

    fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
    })
        .then(async res => {
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400 && data.message) {
                    if (data.message.includes('CPF')) {
                        alert('Este CPF já está cadastrado.');
                        document.getElementById('cpf-cnpj').classList.add('input-error');
                        document.querySelector('label[for="cpf-cnpj"]').classList.add('label-error');
                        return;
                    }

                    if (data.message.includes('Email')) {
                        alert('Este email já está em uso.');
                        document.getElementById('email').classList.add('input-error');
                        document.querySelector('label[for="email"]').classList.add('label-error');
                        return;
                    }
                }

                throw new Error(data.message || 'Erro no cadastro');
            }

            alert('Usuário cadastrado com sucesso!');
            window.location.replace('../pages/login.html');
            console.log(data);
        })
        .catch(err => {
            alert(err.message || 'Erro no cadastro de usuário.');
            console.log(err);
        });
});