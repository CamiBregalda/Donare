package com.utfpr.donare.domain;

import lombok.Getter;

@Getter
public enum TipoUsuario {

    PESSOA_FISICA(0), PESSOA_JURIDICA(1);

    final int codigo;

    private TipoUsuario(int codigo) {
        this.codigo = codigo;
    }

}
