package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NecessidadeRequestDTO {

    @NotBlank(message = "O nome não pode estar em branco.")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres.")
    private String nome;

    @NotBlank(message = "A unidade de medida não pode estar em branco.")
    private String unidadeMedida;


    private Integer quantidadeNecessaria;
    private Integer quantidadeRecebida;

}
