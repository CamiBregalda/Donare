package com.utfpr.donare.dto;


import java.time.LocalDateTime;

public class NecessidadeResponseDTO {

    private Long id;

    private String nome;
    private Integer quantidadeNecessaria;
    private Integer quantidadeRecebida;
    private LocalDateTime dataCriacao;

    private String unidadeMedida;

    private Long campanhaId;
    private String campanhaTitulo;
    private String campanhaCategoria;
    private String campanhaEndereco;
    private String campanhaStatus;
    private String campanhaTipoCertificado;
    private LocalDateTime campanhaDtInicio;
    private LocalDateTime campanhaDtFim;

    public NecessidadeResponseDTO(){

    }

    public NecessidadeResponseDTO(Long id, String nome, Integer quantidadeNecessaria, Integer quantidadeRecebida, String unidadeMedida, LocalDateTime dataCriacao, Long campanhaId, String campanhaTitulo, String campanhaCategoria, String campanhaEndereco, String campanhaStatus, String campanhaTipoCertificado, LocalDateTime campanhaDtInicio, LocalDateTime campanhaDtFim) {
        this.id = id;
        this.nome = nome;
        this.quantidadeNecessaria = quantidadeNecessaria;
        this.quantidadeRecebida = quantidadeRecebida;
        this.unidadeMedida = unidadeMedida;
        this.dataCriacao = dataCriacao;
        this.campanhaId = campanhaId;
        this.campanhaTitulo = campanhaTitulo;
        this.campanhaCategoria = campanhaCategoria;
        this.campanhaEndereco = campanhaEndereco;
        this.campanhaStatus = campanhaStatus;
        this.campanhaTipoCertificado = campanhaTipoCertificado;
        this.campanhaDtInicio = campanhaDtInicio;
        this.campanhaDtFim = campanhaDtFim;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidadeNecessaria() {
        return quantidadeNecessaria;
    }

    public void setQuantidadeNecessaria(Integer quantidadeNecessaria) {
        this.quantidadeNecessaria = quantidadeNecessaria;
    }

    public Integer getQuantidadeRecebida() {
        return quantidadeRecebida;
    }

    public void setQuantidadeRecebida(Integer quantidadeRecebida) {
        this.quantidadeRecebida = quantidadeRecebida;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
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


}
