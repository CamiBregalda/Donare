package com.utfpr.donare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostagemResponseDTO {

    private Long id;
    private String titulo;
    private String conteudo;
    private LocalDateTime dataCriacao;
    private String organizadorEmail;
    private byte[] midia;

    private Long campanhaId;
    private String campanhaTitulo;
    private String campanhaCategoria;
    private String campanhaEndereco;
    private String campanhaStatus;
    private String campanhaTipoCertificado;
    private LocalDateTime campanhaDtInicio = LocalDateTime.now();
    private LocalDateTime campanhaDtFim;
    private String campanhaOrganizadorPrincipal;
}
