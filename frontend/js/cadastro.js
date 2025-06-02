document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpf-cnpj').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;
    const senha = document.getElementById('senha').value;
    const confirmaSenha = document.getElementById('confirma-senha').value;
    
    if(senha !== confirmaSenha){
        alert('As Senhas não coincidem');
        document.getElementById('confirma-senha').focus();
        return;
    }

    //não vi como está essa separação no back
    let tipoDocumento;
    if(cpfCnpj.length == 11){
        tipoDocumento = 'CPF';
    } else{
        tipoDocumento = 'CNPJ'
    }
    
    const novoUsuario = {
        nome: nome,
        email: email,
        cpfCnpj: cpfCnpj,
        tipoDocumento: tipoDocumento,
        endereco: endereco,
        password: senha
    };

    fetch('http://localhost:8080/usuarios',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringfy(novoUsuario)
    })

    .then(res=>{
        if(!res.ok) throw new Error('Erro no Cadastro');
        return res.json();
    })
    .then(data=>{
        alert('Usuário cadastrado com sucesso!');
        console.log(data);
    })
    .catch(err=>{
        alert('Erro no cadastro de usuário.');
        console.log(err);
    });
});