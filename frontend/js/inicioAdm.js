const API_CONFIG = {
    baseURL: 'http://localhost:8080'
};

function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = '../pages/login.html';
        return false;
    }
    
    if (token.trim() === '' || token === 'null' || token === 'undefined') {
        alert('Sessão expirada. Faça login novamente.');
        localStorage.removeItem('token');
        window.location.href = '../pages/login.html';
        return false;
    }
    
    return true;
}

function authHeaders(isJson = true) {
    const token = localStorage.getItem('token') || '';
    const response = { Authorization: `Bearer ${token}` };
    if (isJson) response['Content-Type'] = 'application/json';
    return response;
}

class APIService {
    static async getCampanhas() {
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas`, {
            headers: authHeaders(false) 
        });
        if (!response.ok) throw new Error('Erro ao carregar campanhas');
        return await response.json();
    }

    static async criarCampanha(dados, arquivo = null) {
        const formData = new FormData();
        
        const campanhaBlob = new Blob([JSON.stringify(dados)], {
            type: 'application/json'
        });
        formData.append('campanha', campanhaBlob);
        
        if (arquivo) {
            formData.append('imagemCapa', arquivo);
        }
        
        console.log('Enviando form-data com application/json...');
        console.log('Dados da campanha:', JSON.stringify(dados, null, 2));
        console.log('Arquivo:', arquivo ? arquivo.name : 'Nenhum');
        
        const token = localStorage.getItem('token') || '';
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) throw new Error('Erro ao criar campanha');
        return await response.json();
    }

    static async atualizarCampanha(id, dados, arquivo = null) {
        const formData = new FormData();
        
        const campanhaBlob = new Blob([JSON.stringify(dados)], {
            type: 'application/json'
        });
        formData.append('campanha', campanhaBlob);
        
        if (arquivo) {
            formData.append('imagemCapa', arquivo);
        }
        
        const token = localStorage.getItem('token') || '';
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) throw new Error('Erro ao atualizar campanha');
        return await response.json();
    }

    static async deletarCampanha(id) {
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas/${id}`, {
            method: 'DELETE',
            headers: authHeaders(false)
        });
        if (!response.ok) throw new Error('Erro ao deletar campanha');
    }

    static async getCategorias() {
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas/categorias`, {
            headers: authHeaders(false)
        });
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        return await response.json();
    }

    static async getCertificados() {
        const response = await fetch(`${API_CONFIG.baseURL}/campanhas/certificados`, {
            headers: authHeaders(false)
        });
        if (!response.ok) throw new Error('Erro ao carregar certificados');
        return await response.json();
    }
}

class APIServiceNecessidades {
    static async getNecessidadesCampanha(campanhaId) {
        const response = await fetch(`${API_CONFIG.baseURL}/necessidade/campanhas/${campanhaId}/necessidades`, {
            headers: authHeaders(false)
        });
        if (!response.ok) throw new Error('Erro ao carregar necessidades');
        return await response.json();
    }

    static async criarNecessidade(campanhaId, necessidade) {
        const response = await fetch(`${API_CONFIG.baseURL}/necessidade/campanhas/${campanhaId}/necessidade`, {
            method: 'POST',
            headers: authHeaders(true),  
            body: JSON.stringify(necessidade)
        });
        if (!response.ok) throw new Error('Erro ao criar necessidade');
        return await response.json();
    }

    static async atualizarNecessidade(necessidadeId, necessidade) {
        const response = await fetch(`${API_CONFIG.baseURL}/necessidade/necessidades/${necessidadeId}`, {
            method: 'PUT',
            headers: authHeaders(true), 
            body: JSON.stringify(necessidade)
        });
        if (!response.ok) throw new Error('Erro ao atualizar necessidade');
        return await response.json();
    }

    static async deletarNecessidade(necessidadeId) {
        const response = await fetch(`${API_CONFIG.baseURL}/necessidade/necessidades/${necessidadeId}`, {
            method: 'DELETE',
            headers: authHeaders(false) 
        });
        if (!response.ok) throw new Error('Erro ao deletar necessidade');
    }
}

class GerenciadorCampanhas {
    constructor() {
        this.campanhas = [];
        this.inicializar();
    }

    async inicializar() {
        if (!verificarAutenticacao()) {
            return;
        }

        try {
            console.log('Tentando carregar campanhas da API...');
            const campanhas = await APIService.getCampanhas();
            
            this.campanhas = await Promise.all(campanhas.map(async c => {

    console.log('RECEBIDO - dtInicio:', c.dtInicio);
    console.log('RECEBIDO - dt_fim:', c.dt_fim);    
                let necessidades = '[]';
                try {
                    const necessidadesAPI = await APIServiceNecessidades.getNecessidadesCampanha(c.id);
                    necessidades = JSON.stringify(necessidadesAPI.map(n => ({
                        id: n.id,
                        nome: n.nome,
                        quantidade: n.quantidadeNecessaria,
                        formato: n.unidadeMedida
                    })));
                } catch (error) {
                    console.log(`Erro ao carregar necessidades da campanha ${c.id}:`, error.message);
                }

                return {
                    id: c.id,
                    titulo: c.titulo,
                    local: c.endereco,
                    dataInicio: c.dtInicio?.split('T')[0] || '',
                    dataFim: c.dt_fim?.split('T')[0] || '',
                    urlImagem: c.imagemCapa,
                    status: this.determinarStatus(c.dt_fim),
                    necessidades: necessidades,
                    certificados: c.tipoCertificado || '',
                    categoria: c.categoriaCampanha || '',
                    descricao: c.descricao || ''
                };
            }));
            console.log('Campanhas carregadas da API:', this.campanhas);
        } catch (error) {
            console.log('Erro ao conectar com a API:', error.message);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            this.campanhas = [];
        }
        
        this.renderizarCampanhas();
        this.iniciarVerificadorExpiracao();
    }

    determinarStatus(dataFim) {
        if (!dataFim) return 'ativa';
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const fim = new Date(dataFim);
        fim.setHours(0, 0, 0, 0);
        return fim < hoje ? 'expirada' : 'ativa';
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
        const dataInicio = campanha.dataInicio ? 
            campanha.dataInicio.split('-').reverse().join('/') : 
            'Data não informada';
        const dataFim = campanha.dataFim ? 
            campanha.dataFim.split('-').reverse().join('/') : 
            'Data não informada';
        
        let enderecoTexto = 'Endereço não informado';
        if (campanha.local && typeof campanha.local === 'object') {
            const { logradouro, numero, bairro, cidade } = campanha.local;
            enderecoTexto = `${logradouro || ''} ${numero || ''}, ${bairro || ''}, ${cidade || ''}`.replace(/\s+/g, ' ').trim();
            if (enderecoTexto === ',') enderecoTexto = 'Endereço não informado';
        } else if (campanha.local && typeof campanha.local === 'string') {
            enderecoTexto = campanha.local;
        }
        
        const botaoEditar = campanha.status === 'ativa' ? 
            `<button class="btn-editar" onclick="event.stopPropagation(); gerenciadorCampanhas.editarCampanha(${campanha.id})">✏️ Editar</button>` : '';
        
        setTimeout(() => this.carregarImagemCampanha(campanha.id), 100);
        
        return `
            <div class="cartao-campanha">
                <div class="imagem-campanha" onclick="abrirCampanha(${campanha.id})" style="cursor: pointer;">
                    <img id="imagem-campanha-${campanha.id}" src="" alt="${campanha.titulo}" style="display: none;">
                    <div class="titulo-campanha">${campanha.titulo}</div>
                    ${botaoEditar}
                </div>
                <div class="info-campanha">
                    <div><strong>Local do evento:</strong> ${enderecoTexto}</div>
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
            if (campanha.dataFim) {
                const dataFim = new Date(campanha.dataFim);
                dataFim.setHours(0, 0, 0, 0);
                if (campanha.status === 'ativa' && dataFim < hoje) {
                    campanha.status = 'expirada';
                    mudou = true;
                }
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

    editarCampanha(id) {
        const campanha = this.campanhas.find(c => c.id === id);
        if (campanha) abrirModal(campanha);
    }

    async carregarImagemCampanha(campanhaId) {
    try {
        const response = await fetch(`http://localhost:8080/campanhas/${campanhaId}/imagem`, {
            headers: authHeaders(false)
        });
        
        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            
            const imgElement = document.getElementById(`imagem-campanha-${campanhaId}`);
            if (imgElement) {
                imgElement.src = imageUrl;
                imgElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.log(`Erro ao carregar imagem da campanha ${campanhaId}:`, error.message);
    }
}
}

let gerenciadorCampanhas;
let necessidadesAtual = [];
let modoEdicaoNecessidades = false;

function abrirModalNecessidades() {
    const modalCampanha = document.getElementById('modalCampanha');
    modoEdicaoNecessidades = modalCampanha.dataset.modoEdicao === 'true';
    
    document.getElementById('modalNecessidades').style.display = 'block';
    configurarModalNecessidades();
    renderizarListaNecessidades();
}

function configurarModalNecessidades() {
    const inputItem = document.getElementById('nomeItemModal');
    const inputFormato = document.getElementById('formatoItemModal');
    const btnAdicionar = document.getElementById('btnAdicionarItem');
    
    if (modoEdicaoNecessidades) {
        inputItem.disabled = false;
        inputFormato.disabled = false;
        btnAdicionar.disabled = false;
        btnAdicionar.textContent = 'Adicionar';
    } else {
        inputItem.disabled = false;
        inputFormato.disabled = false;
        btnAdicionar.disabled = false;
        btnAdicionar.textContent = 'Adicionar';
    }
}
function fecharModalNecessidades() {
    document.getElementById('modalNecessidades').style.display = 'none';
}

function adicionarItemModal() {
    
    const nome = document.getElementById('nomeItemModal').value.trim();
    const quantidade = document.getElementById('quantidadeItemModal').value;
    const formato = document.getElementById('formatoItemModal').value;
    
    if (!nome || !quantidade) {
        alert('Por favor, preencha o nome e a quantidade do item.');
        return;
    }
    
    const item = {
        id: Date.now(),
        nome: nome,
        quantidade: parseInt(quantidade),
        formato: formato
    };
    
    necessidadesAtual.push(item);
    renderizarListaNecessidades();
    
    document.getElementById('nomeItemModal').value = '';
    document.getElementById('quantidadeItemModal').value = '';
    document.getElementById('formatoItemModal').selectedIndex = 0;
}


function removerItemModal(id) {
    necessidadesAtual = necessidadesAtual.filter(item => item.id !== id);
    renderizarListaNecessidades();
}

function editarQuantidadeItem(id, novaQuantidade) {
    const quantidade = parseInt(novaQuantidade);
    if (quantidade && quantidade > 0) {
        const item = necessidadesAtual.find(item => item.id === id);
        if (item) {
            item.quantidade = quantidade;
        }
    }
}

function renderizarListaNecessidades() {
    const container = document.getElementById('listaNecessidades');
    
    if (necessidadesAtual.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = necessidadesAtual.map(item => `
        <div class="item-lista">
            <span class="info-item">
                ${item.nome} - 
                ${modoEdicaoNecessidades ? 
                    `<input type="number" value="${item.quantidade}" min="1" 
                     oninput="editarQuantidadeItem(${item.id}, this.value)" 
                     onchange="editarQuantidadeItem(${item.id}, this.value)"
                     style="width: 70px; padding: 4px 8px; border: 2px solid #8BC6A3; border-radius: 6px; margin: 0 5px; font-weight: bold; text-align: center; background: white;">` 
                    : item.quantidade
                } 
                ${item.formato}
            </span>
            <button class="btn-remover-item" onclick="removerItemModal(${item.id})">×</button>
        </div>
    `).join('');
}

function salvarNecessidades() {
    const texto = document.getElementById('textoNecessidades');
    if (necessidadesAtual.length === 0) {
        texto.textContent = 'Adicionar necessidades';
    } else {
        texto.textContent = `${necessidadesAtual.length} ${necessidadesAtual.length === 1 ? 'item adicionado' : 'itens adicionados'}`;
    }
    fecharModalNecessidades();
}

function carregarNecessidadesExistentes(necessidadesString) {
    if (!necessidadesString) {
        necessidadesAtual = [];
        return;
    }
    
    try {
        const necessidades = JSON.parse(necessidadesString);
        necessidadesAtual = necessidades.map(item => ({
            ...item,
            jaExiste: true
        }));
    } catch {
        necessidadesAtual = necessidadesString.split(',').map((item, index) => ({
            id: Date.now() + index,
            nome: item.trim(),
            quantidade: 1,
            formato: 'unidades',
            jaExiste: true
        }));
    }
    
    const texto = document.getElementById('textoNecessidades');
    if (necessidadesAtual.length > 0) {
        texto.textContent = `${necessidadesAtual.length} ${necessidadesAtual.length === 1 ? 'item adicionado' : 'itens adicionados'}`;
    }
}

function obterNecessidadesJSON() {
    return JSON.stringify(necessidadesAtual);
}

function criarNovaCampanha() { 
    abrirModal(); 
}

function obterDadosFormulario() {
    return {
        nome: document.getElementById('nomeCampanha').value.trim(),
        
        endereco:{
            logradouro: document.getElementById('logradouro').value.trim(),
            numero: document.getElementById('numero').value.trim(),
            bairro: document.getElementById('bairro').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            estado: document.getElementById('estado').value.trim(),
            cep: document.getElementById('cep').value.trim()
        },
        necessidades: obterNecessidadesJSON(),
        certificados: document.getElementById('certificados').value,
        categoria: document.getElementById('categoriaCampanha').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFinal: document.getElementById('dataFinal').value,
        descricao: document.getElementById('descricaoCampanha').value.trim()
    };
}

function obterArquivoImagem() {
    const input = document.getElementById('arquivoImagem');
    return input.files[0] || null;
}

function validarDados(dados) {
    if (!dados.nome || !dados.endereco || !dados.dataInicio || !dados.dataFinal) {
        alert('Por favor, preencha os campos obrigatórios: Nome da Campanha, Endereço do Evento, Data de Início e Data Final.');
        return false;
    }
    
    const dataInicio = new Date(dados.dataInicio);
    const dataFinal = new Date(dados.dataFinal);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataFinal <= dataInicio) {
        alert('A data final deve ser posterior à data de início.');
        return false;
    }
    
    if (dataFinal < hoje) {
        alert('A data final não pode ser anterior à data atual. Não é possível criar campanhas que já expiraram.');
        return false;
    }
    
    return true;
}

function preencherFormulario(campanha) {
    document.getElementById('nomeCampanha').value = campanha.titulo || '';
    
    if (campanha.local && typeof campanha.local === 'object') {
        document.getElementById('logradouro').value = campanha.local.logradouro || '';
        document.getElementById('numero').value = campanha.local.numero || '';
        document.getElementById('bairro').value = campanha.local.bairro || '';
        document.getElementById('cidade').value = campanha.local.cidade || '';
        document.getElementById('estado').value = campanha.local.estado || '';
        document.getElementById('cep').value = campanha.local.cep || '';
    } else {
        document.getElementById('logradouro').value = '';
        document.getElementById('numero').value = '';
        document.getElementById('bairro').value = '';
        document.getElementById('cidade').value = '';
        document.getElementById('estado').value = '';
        document.getElementById('cep').value = '';
    }

    document.getElementById('dataInicio').value = campanha.dataInicio || '';
    document.getElementById('dataFinal').value = campanha.dataFim || '';
    document.getElementById('descricaoCampanha').value = campanha.descricao || '';
    document.getElementById('certificados').value = campanha.certificados || '';
    document.getElementById('categoriaCampanha').value = campanha.categoria || '';
    
    if (campanha.urlImagem) {
        document.querySelector('.upload-area').innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                <img src="${campanha.urlImagem}" alt="Imagem da campanha" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
                <button onclick="removerImagemEdicao()" style="position: absolute; top: 10px; right: 10px; background: #000000; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
            </div>`;
    }
    carregarNecessidadesExistentes(campanha.necessidades);
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
    document.getElementById('modalCampanha').style.display = 'none';
    limparFormulario();
    configurarModal(false);
}

async function salvarCampanha() {
    const dados = obterDadosFormulario();
    if (!validarDados(dados)) return;

    try {

        console.log('ENVIANDO - dataInicio:', dados.dataInicio);
        console.log('ENVIANDO - dataFinal:', dados.dataFinal);
        const dadosAPI = {
            titulo: dados.nome,
            descricao: dados.descricao,
            categoriaCampanha: dados.categoria,
            endereco: dados.endereco,
            tipoCertificado: dados.certificados,
            dtInicio: new Date(dados.dataInicio + 'T00:00:00.000Z').toISOString(),
            dt_fim: new Date(dados.dataFinal + 'T00:00:00.000Z').toISOString(),
            status: "ativa"
        };
        
        console.log('ENVIANDO - dtInicio formatado:', dadosAPI.dtInicio);
        console.log('ENVIANDO - dt_fim formatado:', dadosAPI.dt_fim);
        const arquivo = obterArquivoImagem();
        const novaCampanha = await APIService.criarCampanha(dadosAPI, arquivo);
        
        if (necessidadesAtual.length > 0) {
            for (const necessidade of necessidadesAtual) {
                const necessidadeAPI = {
                    nome: necessidade.nome,
                    unidadeMedida: necessidade.formato,
                    quantidadeNecessaria: necessidade.quantidade,
                    quantidadeRecebida: 0
                };
                
                try {
                    await APIServiceNecessidades.criarNecessidade(novaCampanha.id, necessidadeAPI);
                } catch (error) {
                    console.log('Erro ao salvar necessidade:', necessidade.nome, error.message);
                }
            }
        }
        
        await gerenciadorCampanhas.inicializar();
        fecharModal();
        
    } catch (error) {
        alert('Erro ao salvar campanha: ' + error.message);
    }
}

async function salvarEdicaoCampanha(id) {
    const dados = obterDadosFormulario();
    if (!validarDados(dados)) return;

    try {
        const dadosAPI = {
            titulo: dados.nome,
            descricao: dados.descricao,
            categoriaCampanha: dados.categoria,
            endereco: dados.endereco,
            tipoCertificado: dados.certificados,
            dtInicio: new Date(dados.dataInicio + 'T00:00:00.000Z').toISOString(),
            dt_fim: new Date(dados.dataFinal + 'T00:00:00.000Z').toISOString(),
            status: "ativa"
        };

        const arquivo = obterArquivoImagem();
        await APIService.atualizarCampanha(id, dadosAPI, arquivo);
        
        let necessidadesExistentes = [];
        try {
            necessidadesExistentes = await APIServiceNecessidades.getNecessidadesCampanha(id);
        } catch (error) {
            console.log('Erro ao carregar necessidades existentes:', error.message);
        }
        
        for (const necessidadeAtual of necessidadesAtual) {
            if (necessidadeAtual.jaExiste) {
                const necessidadeExistente = necessidadesExistentes.find(n => n.nome === necessidadeAtual.nome);
                if (necessidadeExistente) {
                    const necessidadeAtualizada = {
                        nome: necessidadeExistente.nome,
                        unidadeMedida: necessidadeExistente.unidadeMedida,
                        quantidadeNecessaria: necessidadeAtual.quantidade,
                        quantidadeRecebida: necessidadeExistente.quantidadeRecebida || 0
                    };
                    await APIServiceNecessidades.atualizarNecessidade(necessidadeExistente.id, necessidadeAtualizada);
                }
            } else {
                const novaNecessidade = {
                    nome: necessidadeAtual.nome,
                    unidadeMedida: necessidadeAtual.formato,
                    quantidadeNecessaria: necessidadeAtual.quantidade,
                    quantidadeRecebida: 0
                };
                await APIServiceNecessidades.criarNecessidade(id, novaNecessidade);
            }
        }
        
        const necessidadesAtuaisNomes = necessidadesAtual.map(n => n.nome);
        for (const necessidadeExistente of necessidadesExistentes) {
            if (!necessidadesAtuaisNomes.includes(necessidadeExistente.nome)) {
                await APIServiceNecessidades.deletarNecessidade(necessidadeExistente.id);
            }
        }
        
        await gerenciadorCampanhas.inicializar();
        fecharModal();
        
    } catch (error) {
        alert('Erro ao atualizar campanha: ' + error.message);
    }
}

async function excluirCampanha(id) {
    if (confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
        try {
            console.log('Tentando excluir na API...');
            await APIService.deletarCampanha(id);
            console.log('Campanha excluída da API');
            
            await gerenciadorCampanhas.inicializar();
            fecharModal();
            
        } catch (error) {
            console.log('Erro na API:', error.message);
            alert('Erro ao excluir campanha: ' + error.message);
        }
    }
}

function limparFormulario() {
    ['nomeCampanha', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'dataInicio', 'dataFinal', 'descricaoCampanha', 'arquivoImagem'].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = '';
    });
    
    const selectCertificados = document.getElementById('certificados');
    const selectCategoria = document.getElementById('categoriaCampanha');
    if (selectCertificados) selectCertificados.selectedIndex = 0;
    if (selectCategoria) selectCategoria.selectedIndex = 0;
    
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) uploadArea.innerHTML = '<div class="upload-circle">+</div>';
    
    necessidadesAtual = [];
    const textoNecessidades = document.getElementById('textoNecessidades');
    if (textoNecessidades) textoNecessidades.textContent = 'Adicionar necessidades';
}

function abrirSeletorArquivo() { 
    document.getElementById('arquivoImagem').click(); 
}

function removerImagemEdicao() {
    document.querySelector('.upload-area').innerHTML = '<div class="upload-circle">+</div>';
    document.getElementById('arquivoImagem').value = '';
}

document.addEventListener('click', e => {
    if (e.target.id === 'modalCampanha') fecharModal();
});

function configurarValidacoesDatas() {
    const hoje = new Date().toISOString().split('T')[0];
    const inputDataFinal = document.getElementById('dataFinal');
    const inputDataInicio = document.getElementById('dataInicio');
    
    if (inputDataFinal) inputDataFinal.min = hoje;
    
    if (inputDataInicio && inputDataFinal) {
        inputDataFinal.addEventListener('change', () => {
            const dataFinal = inputDataFinal.value;
            if (dataFinal && dataFinal < hoje) {
                alert('A data final não pode ser anterior à data atual.');
                inputDataFinal.value = '';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!verificarAutenticacao()) {
        return;
    }
    
    gerenciadorCampanhas = new GerenciadorCampanhas();
    configurarValidacoesDatas();   
    carregarCategorias();
    carregarCertificados();
    
    
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
});

function abrirCampanha(campanhaId) {
    window.location.href = `../pages/CampanhaAdm.html?id=${campanhaId}`;
}

async function carregarCategorias() {
    try {
        const categorias = await APIService.getCategorias();
        const selectCategoria = document.getElementById('categoriaCampanha');
        
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
        
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
        
    } catch (error) {
        console.log('Erro ao carregar categorias:', error.message);
    }
}

async function carregarCertificados() {
    try {
        const certificados = await APIService.getCertificados();
        const selectCertificados = document.getElementById('certificados');
        
        selectCertificados.innerHTML = '<option value="">Selecione um certificado</option>';
        
        certificados.forEach(certificado => {
            const option = document.createElement('option');
            option.value = certificado;
            option.textContent = certificado;
            selectCertificados.appendChild(option);
        });
        
    } catch (error) {
        console.log('Erro ao carregar certificados:', error.message);
    }
}