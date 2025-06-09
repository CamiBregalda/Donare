package com.utfpr.donare.domain;

import lombok.Getter;

@Getter
public enum EmailType {

    CERTIFICADO(0, "Certificado de participação");

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
