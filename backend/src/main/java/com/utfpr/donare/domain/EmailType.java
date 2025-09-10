package com.utfpr.donare.domain;

import lombok.Getter;

@Getter
public enum EmailType {

    CERTIFICADO(0, "Certificado de participação"),
    CADASTROCONTA(1, "Cadastro de conta"),
    NOVOCOMENTARIO(2, "Novo comentário em campanha"),
    NOVARESPOSTA(3, "Nova resposta em comentário"),
    ATUALIZACAOCAMPANHA(4, "Atualização de campanha"),
    NOVAPOSTAGEM(5, "Nova postagem em campanha");


    private final int code;
    private final String description;

    EmailType(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public static EmailType fromCode(int code) {

        for (EmailType type : EmailType.values()) {
            if (type.code == code) return type;
        }

        throw new IllegalArgumentException("Código inválido: " + code);
    }
}
