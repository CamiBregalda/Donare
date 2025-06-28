package com.utfpr.donare.domain.enums;

public enum TipoCertificadoEnum {
    DOACAO("Certificado de Doação"),
    VOLUNTARIADO("Certificado de Voluntariado");

    private final String descricao;

    TipoCertificadoEnum(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
