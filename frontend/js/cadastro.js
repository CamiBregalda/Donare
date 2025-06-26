document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpf-cnpj').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;

    //endereço
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;
    
    if(senha !== confirmaSenha){
        alert('As Senhas não coincidem');
        document.getElementById('confirma-senha').focus();
        return;
    }

    let tipoDocumento;
    if(cpfCnpj.length == 11){
        tipoDocumento = 1;
    } else{
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

    fetch('http://localhost:8080/usuarios',{
        method: 'POST',
        headers: {'Accept': 'application/json'},
        body: formData
    })

    .then(res=>{
        if(!res.ok) throw new Error('Erro no Cadastro');
        return res.json();
    })
    .then(data=>{
        alert('Usuário cadastrado com sucesso!');
        window.location.replace('../pages/login.html');
        console.log(data);
    })
    .catch(err=>{
        alert('Erro no cadastro de usuário.');
        console.log(err);
    });
});