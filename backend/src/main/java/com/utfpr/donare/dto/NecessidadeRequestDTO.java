package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class NecessidadeRequestDTO {

    @NotBlank(message = "O nome não pode estar em branco.")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres.")
    private String nome;

    @NotBlank(message = "A unidade de medida não pode estar em branco.")
    private String unidadeMedida;


    private Integer quantidadeNecessaria;
    private Integer quantidadeRecebida;


    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public Integer getQuantidadeNecessaria() {
        return quantidadeNecessaria;
    }

    public void setQuantidadeNecessaria(Integer quantidadeNecessaria) {
        this.quantidadeNecessaria = quantidadeNecessaria;}

    public Integer getQuantidadeRecebida() {
        return quantidadeRecebida;
    }

    public void setQuantidadeRecebida(Integer quantidadeRecebida) {
        this.quantidadeRecebida = quantidadeRecebida;}


}
