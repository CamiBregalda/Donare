package com.utfpr.donare.domain;

public enum TipoUsuario {

    PESSOA_FISICA(0), PESSOA_JURIDICA(1);

    final int codigo;

    private TipoUsuario(int codigo) {
        this.codigo = codigo;
    }

    public int getCodigo() {
        return codigo;
    }
}
