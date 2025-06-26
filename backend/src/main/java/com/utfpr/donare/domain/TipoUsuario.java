package com.utfpr.donare.domain;

import lombok.Getter;

@Getter
public enum TipoUsuario {

    PESSOA_FISICA(1), PESSOA_JURIDICA(2);

    final int codigo;

    private TipoUsuario(int codigo) {
        this.codigo = codigo;
    }

}
