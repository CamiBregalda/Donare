package com.utfpr.donare.model;
import java.time.LocalDateTime;
import java.util.Objects;

//import com.fasterxml.jackson.annotation.JsonIgnore;

import com.utfpr.donare.controller.NecessidadeController;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "necessidade")
public class Necessidade {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nome;
    private Integer quantidadeNecessaria;
    private Integer quantidadeRecebida;
    @Column(nullable = false)
    private String unidadeMedida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id",  nullable = false)
    private Campanha campanha;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    public Necessidade(){

    }

    public Necessidade(Long id, String nome, Integer quantidadeNecessaria, Integer quantidadeRecebida, String unidadeMedida, Campanha campanha) {
        this.id = id;
        this.nome = nome;
        this.quantidadeNecessaria = quantidadeNecessaria;
        this.quantidadeRecebida = quantidadeRecebida;
        this.unidadeMedida = unidadeMedida;
        this.campanha = campanha;
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

    public Campanha getCampanha() {
        return campanha;
    }

    public void setCampanha(Campanha campanha) {
        this.campanha = campanha;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Necessidade that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public void atualizarQuantidadeRecebida (int quantidade){

    }
}
