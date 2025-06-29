package com.utfpr.donare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampanhaResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String categoriaCampanha;
    private EnderecoResponseDto endereco;
    private byte[] imagemCapa;
    private String status;
    private String tipoCertificado;
    private LocalDateTime dtInicio;
    private LocalDateTime dt_fim;
    private String organizador;
    private List<PostagemResponseDTO> postagens = new ArrayList<>();
}
