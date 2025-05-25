package com.utfpr.donare.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NecessidadeResponseDTO {

    private Long id;

    private String nome;
    private Integer quantidadeNecessaria;
    private Integer quantidadeRecebida;
    private LocalDateTime dataCriacao;

    private String unidadeMedida;

    private Long campanhaId;
    private String campanhaTitulo;
    private String campanhaCategoria;
    private String campanhaEndereco;
    private String campanhaStatus;
    private String campanhaTipoCertificado;
    private LocalDateTime campanhaDtInicio;
    private LocalDateTime campanhaDtFim;



}
