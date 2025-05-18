package com.utfpr.donare.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "postagem")
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id", nullable = false)
    private Campanha campanha;

    @Column(nullable = false)
    private String organizadorEmail;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "postagem_midias", joinColumns = @JoinColumn(name = "postagem_id"))
    @Column(name = "midia_url", columnDefinition = "TEXT")
    private List<String> midias = new ArrayList<>();

    public Postagem() {
    }

    public Postagem(String titulo, String conteudo, Campanha campanha, String organizadorEmail) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.campanha = campanha;
        this.organizadorEmail = organizadorEmail;
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

    public Campanha getCampanha() {
        return campanha;
    }

    public void setCampanha(Campanha campanha) {
        this.campanha = campanha;
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

    public void addMidia(String midiaUrl) {
        this.midias.add(midiaUrl);
    }

    public void removeMidia(String midiaUrl) {
        this.midias.remove(midiaUrl);
    }

    public void clearMidias() {
        this.midias.clear();
    }
}

