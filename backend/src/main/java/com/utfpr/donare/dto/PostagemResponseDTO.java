package com.utfpr.donare.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostagemResponseDTO {

    private Long id;
    private String titulo;
    private String conteudo; // Usado como descricao na resposta
    private LocalDateTime dataCriacao;
    private String organizadorEmail;
    private List<String> midias;

    private Long campanhaId;
    private String campanhaTitulo;
    private String campanhaCategoria;
    private String campanhaEndereco;
    private String campanhaStatus;
    private String campanhaTipoCertificado;
    private LocalDateTime campanhaDtInicio;
    private LocalDateTime campanhaDtFim;
    private String campanhaOrganizadorPrincipal;

    public PostagemResponseDTO() {
    }

    public PostagemResponseDTO(Long id, String titulo, String conteudo, LocalDateTime dataCriacao, String organizadorEmail, List<String> midias, Long campanhaId, String campanhaTitulo, String campanhaCategoria, String campanhaEndereco, String campanhaStatus, String campanhaTipoCertificado, LocalDateTime campanhaDtInicio, LocalDateTime campanhaDtFim, String campanhaOrganizadorPrincipal) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.dataCriacao = dataCriacao;
        this.organizadorEmail = organizadorEmail;
        this.midias = midias;
        this.campanhaId = campanhaId;
        this.campanhaTitulo = campanhaTitulo;
        this.campanhaCategoria = campanhaCategoria;
        this.campanhaEndereco = campanhaEndereco;
        this.campanhaStatus = campanhaStatus;
        this.campanhaTipoCertificado = campanhaTipoCertificado;
        this.campanhaDtInicio = campanhaDtInicio;
        this.campanhaDtFim = campanhaDtFim;
        this.campanhaOrganizadorPrincipal = campanhaOrganizadorPrincipal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getOrganizadorEmail() {
        return organizadorEmail;
    }

    public void setOrganizadorEmail(String organizadorEmail) {
        this.organizadorEmail = organizadorEmail;
    }

    public List<String> getMidias() {
        return midias;
    }

    public void setMidias(List<String> midias) {
        this.midias = midias;
    }

    public Long getCampanhaId() {
        return campanhaId;
    }

    public void setCampanhaId(Long campanhaId) {
        this.campanhaId = campanhaId;
    }

    public String getCampanhaTitulo() {
        return campanhaTitulo;
    }

    public void setCampanhaTitulo(String campanhaTitulo) {
        this.campanhaTitulo = campanhaTitulo;
    }

    public String getCampanhaCategoria() {
        return campanhaCategoria;
    }

    public void setCampanhaCategoria(String campanhaCategoria) {
        this.campanhaCategoria = campanhaCategoria;
    }

    public String getCampanhaEndereco() {
        return campanhaEndereco;
    }

    public void setCampanhaEndereco(String campanhaEndereco) {
        this.campanhaEndereco = campanhaEndereco;
    }

    public String getCampanhaStatus() {
        return campanhaStatus;
    }

    public void setCampanhaStatus(String campanhaStatus) {
        this.campanhaStatus = campanhaStatus;
    }

    public String getCampanhaTipoCertificado() {
        return campanhaTipoCertificado;
    }

    public void setCampanhaTipoCertificado(String campanhaTipoCertificado) {
        this.campanhaTipoCertificado = campanhaTipoCertificado;
    }

    public LocalDateTime getCampanhaDtInicio() {
        return campanhaDtInicio;
    }

    public void setCampanhaDtInicio(LocalDateTime campanhaDtInicio) {
        this.campanhaDtInicio = campanhaDtInicio;
    }

    public LocalDateTime getCampanhaDtFim() {
        return campanhaDtFim;
    }

    public void setCampanhaDtFim(LocalDateTime campanhaDtFim) {
        this.campanhaDtFim = campanhaDtFim;
    }

    public String getCampanhaOrganizadorPrincipal() {
        return campanhaOrganizadorPrincipal;
    }

    public void setCampanhaOrganizadorPrincipal(String campanhaOrganizadorPrincipal) {
        this.campanhaOrganizadorPrincipal = campanhaOrganizadorPrincipal;
    }
}

