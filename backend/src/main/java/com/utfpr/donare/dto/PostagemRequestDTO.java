package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class PostagemRequestDTO {

    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;

    private List<String> midiasUrls;

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

    public List<String> getMidiasUrls() {
        return midiasUrls;
    }

    public void setMidiasUrls(List<String> midiasUrls) {
        this.midiasUrls = midiasUrls;
    }
}

