class GerenciadorCampanhas {
    constructor() {
        this.campanhas = [];
        this.inicializar();
    }

    inicializar() {
        this.renderizarCampanhas();
        this.iniciarVerificadorExpiracao();
    }

    salvarCampanhas() {
        console.log('Campanhas salvas:', this.campanhas);
    }

    renderizarCampanhas() {
        const ativas = this.campanhas.filter(c => c.status === 'ativa');
        const expiradas = this.campanhas.filter(c => c.status === 'expirada');
        this.renderizarLista('campanhasAtivas', ativas);
        this.renderizarLista('campanhasExpiradas', expiradas);
    }

    renderizarLista(containerId, campanhas) {
        const container = document.getElementById(containerId);
        const isEmpty = campanhas.length === 0;
        const isActive = containerId === 'campanhasAtivas';
        
        container.innerHTML = isEmpty ? 
            `<div style="text-align: center; color: #999; padding: 40px; font-style: italic;">
                ${isActive ? 'Nenhuma campanha ativa' : 'Nenhuma campanha no histórico'}
            </div>` :
            campanhas.map(c => this.criarCard(c)).join('');
    }

    criarCard(campanha) {
        const dataInicio = new Date(campanha.dataInicio).toLocaleDateString('pt-BR');
        const dataFim = new Date(campanha.dataFim).toLocaleDateString('pt-BR');
        const botaoEditar = campanha.status === 'ativa' ? 
            `<button class="btn-editar" onclick="gerenciadorCampanhas.editarCampanha(${campanha.id})">✏️ Editar</button>` : '';
        
        return `
            <div class="cartao-campanha">
                <div class="imagem-campanha">
                    ${campanha.urlImagem ? `<img src="${campanha.urlImagem}" alt="${campanha.titulo}" onerror="this.style.display='none'">` : ''}
                    <div class="titulo-campanha">${campanha.titulo}</div>
                    ${botaoEditar}
                </div>
                <div class="info-campanha">
                    <div><strong>Local do evento:</strong> ${campanha.local}</div>
                    <div><strong>Data de início:</strong> ${dataInicio}</div>
                    <div><strong>Data de fim:</strong> ${dataFim}</div>
                </div>
            </div>`;
    }

    verificarCampanhasExpiradas() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        let mudou = false;

        this.campanhas.forEach(campanha => {
            const dataFim = new Date(campanha.dataFim);
            dataFim.setHours(0, 0, 0, 0);
            if (campanha.status === 'ativa' && dataFim < hoje) {
                campanha.status = 'expirada';
                mudou = true;
            }
        });

        if (mudou) {
            this.salvarCampanhas();
            this.renderizarCampanhas();
        }
    }

    iniciarVerificadorExpiracao() {
        setInterval(() => this.verificarCampanhasExpiradas(), 60000);
        this.verificarCampanhasExpiradas();
    }

    mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.style.cssText = `position: fixed; top: 20px; right: 20px; background: #8BC6A3; color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 15px #000000; z-index: 2000; font-weight: 500; animation: deslizarEntrada 0.3s ease;`;
        notificacao.textContent = mensagem;

        if (!document.querySelector('style[data-notification]')) {
            const estilo = document.createElement('style');
            estilo.setAttribute('data-notification', 'true');
            estilo.textContent = '@keyframes deslizarEntrada { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
            document.head.appendChild(estilo);
        }

        document.body.appendChild(notificacao);
        setTimeout(() => {
            notificacao.style.animation = 'deslizarEntrada 0.3s ease reverse';
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    editarCampanha(id) {
        const campanha = this.campanhas.find(c => c.id === id);
        if (campanha) abrirModal(campanha);
    }

    adicionarDadosExemplo() {
        const hoje = new Date();
        const proximaSemana = new Date(hoje);
        proximaSemana.setDate(proximaSemana.getDate() + 7);
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);

        this.campanhas = [
            {
                id: 1, titulo: 'Doação de Alimentos', local: 'UTFPR',
                dataInicio: hoje.toISOString().split('T')[0], dataFim: proximaSemana.toISOString().split('T')[0],
                urlImagem: 'https://img.migalhas.com.br/gf_Base/empresas/miga/imagens/C834420846D5510C90B88E720709A471B8E5_doacao.jpg',
                status: 'ativa', necessidades: 'Alimentos não perecíveis',
                certificados: 'fulano', categoria: 'a',
                descricao: 'blablalba'
            },
            {
                id: 2, titulo: 'Campanha de Agasalhos', local: 'Praça 500',
                dataInicio: ontem.toISOString().split('T')[0], dataFim: ontem.toISOString().split('T')[0],
                urlImagem: 'https://ogimg.infoglobo.com.br/in/22799539-a0c-cff/FT1086A/70757225.jpg',
                status: 'expirada', necessidades: 'Roupas de inverno',
                certificados: 'fulano', categoria: 'b',
                descricao: 'Arrecadação de agasalhos para o período de inverno.'
            }
        ];
        this.renderizarCampanhas();
    }
}

let gerenciadorCampanhas;

function criarNovaCampanha() { abrirModal(); }

function obterDadosFormulario() {
    return {
        nome: document.getElementById('nomeCampanha').value.trim(),
        endereco: document.getElementById('enderecoEvento').value.trim(),
        necessidades: document.getElementById('necessidadesEvento').value.trim(),
        certificados: document.getElementById('certificados').value,
        categoria: document.getElementById('categoriaCampanha').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFinal: document.getElementById('dataFinal').value,
        descricao: document.getElementById('descricaoCampanha').value.trim()
    };
}

function validarDados(dados) {
    if (!dados.nome || !dados.endereco || !dados.dataInicio || !dados.dataFinal) {
        alert('Por favor, preencha os campos obrigatórios: Nome da Campanha, Endereço do Evento, Data de Início e Data Final.');
        return false;
    }
    if (new Date(dados.dataFinal) <= new Date(dados.dataInicio)) {
        alert('A data final deve ser posterior à data de início.');
        return false;
    }
    return true;
}

function preencherFormulario(campanha) {
    const campos = ['nomeCampanha', 'enderecoEvento', 'necessidadesEvento', 'dataInicio', 'dataFinal', 'descricaoCampanha'];
    const dados = [campanha.titulo, campanha.local, campanha.necessidades, campanha.dataInicio, campanha.dataFim, campanha.descricao];
    campos.forEach((campo, i) => document.getElementById(campo).value = dados[i] || '');
    
    document.getElementById('certificados').value = campanha.certificados || '';
    document.getElementById('categoriaCampanha').value = campanha.categoria || '';
    
    if (campanha.urlImagem) {
        document.querySelector('.upload-area').innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                <img src="${campanha.urlImagem}" alt="Imagem da campanha" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
                <button onclick="removerImagemEdicao()" style="position: absolute; top: 10px; right: 10px; background: #000000; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
            </div>`;
    }
}

function configurarModal(modoEdicao, campanha = null) {
    const modal = document.getElementById('modalCampanha');
    const titulo = document.querySelector('.modal-header h2');
    const btnCancelar = document.querySelector('.btn-cancelar');
    const btnConcluir = document.querySelector('.btn-concluir');
    
    if (modoEdicao) {
        titulo.textContent = 'Editar Campanha';
        btnCancelar.textContent = 'Excluir';
        btnCancelar.onclick = () => excluirCampanha(campanha.id);
        btnConcluir.textContent = 'Salvar';
        btnConcluir.onclick = () => salvarEdicaoCampanha(campanha.id);
        modal.dataset.campanhaId = campanha.id;
        modal.dataset.modoEdicao = 'true';
    } else {
        titulo.textContent = 'Cadastre sua Campanha';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = fecharModal;
        btnConcluir.textContent = 'Concluir';
        btnConcluir.onclick = salvarCampanha;
        delete modal.dataset.campanhaId;
        delete modal.dataset.modoEdicao;
    }
}

function abrirModal(campanha = null) {
    document.getElementById('modalCampanha').style.display = 'block';
    if (campanha) {
        preencherFormulario(campanha);
        configurarModal(true, campanha);
    } else {
        limparFormulario();
        configurarModal(false);
    }
}

function fecharModal() {
    const modal = document.getElementById('modalCampanha');
    const modoEdicao = modal.dataset.modoEdicao === 'true';
    modal.style.display = 'none';
    limparFormulario();
    configurarModal(false);
}

function salvarCampanha() {
    const dados = obterDadosFormulario();
    if (!validarDados(dados)) return;

    const novaCampanha = {
        id: Date.now(), titulo: dados.nome, local: dados.endereco,
        dataInicio: dados.dataInicio, dataFim: dados.dataFinal, urlImagem: null,
        status: new Date(dados.dataFinal) < new Date() ? 'expirada' : 'ativa',
        necessidades: dados.necessidades, certificados: dados.certificados,
        categoria: dados.categoria, descricao: dados.descricao
    };

    gerenciadorCampanhas.campanhas.push(novaCampanha);
    gerenciadorCampanhas.renderizarCampanhas();
    gerenciadorCampanhas.mostrarNotificacao('Campanha criada com sucesso!');
    document.getElementById('modalCampanha').style.display = 'none';
    limparFormulario();
    configurarModal(false);
}

function salvarEdicaoCampanha(id) {
    const dados = obterDadosFormulario();
    if (!validarDados(dados)) return;

    const campanha = gerenciadorCampanhas.campanhas.find(c => c.id === id);
    if (campanha) {
        Object.assign(campanha, {
            titulo: dados.nome, local: dados.endereco, necessidades: dados.necessidades,
            certificados: dados.certificados, categoria: dados.categoria,
            dataInicio: dados.dataInicio, dataFim: dados.dataFinal, descricao: dados.descricao,
            status: new Date(dados.dataFinal) < new Date() ? 'expirada' : 'ativa'
        });

        const novoArquivo = document.getElementById('arquivoImagem').files[0];
        
        gerenciadorCampanhas.salvarCampanhas();
        gerenciadorCampanhas.renderizarCampanhas();
        gerenciadorCampanhas.mostrarNotificacao('Campanha atualizada com sucesso!');
        document.getElementById('modalCampanha').style.display = 'none';
        limparFormulario();
        configurarModal(false);
    }
}

function excluirCampanha(id) {
    if (confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
        gerenciadorCampanhas.campanhas = gerenciadorCampanhas.campanhas.filter(c => c.id !== id);
        gerenciadorCampanhas.salvarCampanhas();
        gerenciadorCampanhas.renderizarCampanhas();
        gerenciadorCampanhas.mostrarNotificacao('Campanha excluída com sucesso!');
        document.getElementById('modalCampanha').style.display = 'none';
        limparFormulario();
        configurarModal(false);
    }
}

function limparFormulario() {
    ['nomeCampanha', 'enderecoEvento', 'necessidadesEvento', 'dataInicio', 'dataFinal', 'descricaoCampanha', 'arquivoImagem'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('certificados').selectedIndex = 0;
    document.getElementById('categoriaCampanha').selectedIndex = 0;
    document.querySelector('.upload-area').innerHTML = '<div class="upload-circle">+</div>';
}

function verificarDadosPreenchidos() {
    const campos = ['nomeCampanha', 'enderecoEvento', 'necessidadesEvento', 'dataInicio', 'dataFinal', 'descricaoCampanha'];
    const selects = ['certificados', 'categoriaCampanha'];
    return campos.some(c => document.getElementById(c).value.trim()) || 
           selects.some(s => document.getElementById(s).selectedIndex > 0) || 
           document.getElementById('arquivoImagem').files.length > 0;
}

function abrirSeletorArquivo() { document.getElementById('arquivoImagem').click(); }
function removerImagemEdicao() {
    document.querySelector('.upload-area').innerHTML = '<div class="upload-circle">+</div>';
    document.getElementById('arquivoImagem').value = '';
}

document.addEventListener('click', e => {
    if (e.target.id === 'modalCampanha') fecharModal();
});

document.addEventListener('DOMContentLoaded', () => {
    gerenciadorCampanhas = new GerenciadorCampanhas();
    
    const inputArquivo = document.getElementById('arquivoImagem');
    const uploadArea = document.querySelector('.upload-area');
    
    if (inputArquivo && uploadArea) {
        inputArquivo.addEventListener('change', e => {
            const arquivo = e.target.files[0];
            uploadArea.innerHTML = arquivo ? 
                `<div style="text-align: center; color: #4A6B5A; font-size: 12px; padding: 10px;">Arquivo selecionado:<br><strong>${arquivo.name}</strong></div>` :
                '<div class="upload-circle">+</div>';
        });
    }
    
    setTimeout(() => gerenciadorCampanhas.adicionarDadosExemplo(), 500);
});