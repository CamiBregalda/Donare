package com.utfpr.donare.domain.enums;

public enum CategoriaEnum {
    DOACAO_ALIMENTOS("Doação de Alimentos"),
    DOACAO_ROUPAS("Doação de Roupas"),
    DOACAO_BRINQUEDOS("Doação de Brinquedos"),
    DOACAO_MATERIAL_ESCOLAR("Doação de Material Escolar"),
    DOACAO_PRODUTOS_HIGIENE("Doação de Produtos de Higiene"),
    DOACAO_SANGUE("Doação de Sangue"),
    ADOCAO_ANIMAL("Adoção de Animais"),
    EVENTO_BAZAR_SOLIDARIO("Bazar Solidário"),
    EVENTO_ALMOCO_SOLIDARIO("Almoço Solidário"),
    MUTIRAO_LIMPEZA("Mutirão de Limpeza"),
    OUTROS("Outros");

    private final String descricao;

    CategoriaEnum(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}