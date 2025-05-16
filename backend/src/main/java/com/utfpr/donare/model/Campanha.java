package com.utfpr.donare.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campanha")
public class Campanha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String categoriaCampanha;

    private String endereco;

    private String status;

    private String tipoCertificado;

    private LocalDateTime dt_inicio;

    private LocalDateTime dt_fim;

    @Column(nullable = false)
    private String organizador;

    @OneToMany(mappedBy = "campanha", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Postagem> postagens = new ArrayList<>();

    public Campanha() {
    }

    public Campanha(String titulo, String descricao, String categoriaCampanha, String endereco,
                    String status, String tipoCertificado, LocalDateTime dt_inicio, LocalDateTime dt_fim, String organizador) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoriaCampanha = categoriaCampanha;
        this.endereco = endereco;
        this.status = status;
        this.tipoCertificado = tipoCertificado;
        this.dt_inicio = dt_inicio;
        this.dt_fim = dt_fim;
        this.organizador = organizador;
    }

    // Getters e Setters
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCategoriaCampanha() {
        return categoriaCampanha;
    }

    public void setCategoriaCampanha(String categoriaCampanha) {
        this.categoriaCampanha = categoriaCampanha;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTipoCertificado() {
        return tipoCertificado;
    }

    public void setTipoCertificado(String tipoCertificado) {
        this.tipoCertificado = tipoCertificado;
    }

    public LocalDateTime getDt_inicio() {
        return dt_inicio;
    }

    public void setDt_inicio(LocalDateTime dt_inicio) {
        this.dt_inicio = dt_inicio;
    }

    public LocalDateTime getDt_fim() {
        return dt_fim;
    }

    public void setDt_fim(LocalDateTime dt_fim) {
        this.dt_fim = dt_fim;
    }

    public String getOrganizador() {
        return organizador;
    }

    public void setOrganizador(String organizador) {
        this.organizador = organizador;
    }

    public List<Postagem> getPostagens() {
        return postagens;
    }

    public void setPostagens(List<Postagem> postagens) {
        this.postagens = postagens;
    }

    public void addPostagem(Postagem postagem) {
        this.postagens.add(postagem);
        postagem.setCampanha(this);
    }

    public void removePostagem(Postagem postagem) {
        this.postagens.remove(postagem);
        postagem.setCampanha(null);
    }
}

