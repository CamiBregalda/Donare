package com.utfpr.donare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioResponseDTO {

    private Long id;

    private String conteudo;

    private LocalDateTime dataCriacao;

    private UserResponseDTO userResponseDTO;

    private Long idComentarioPai;

    private Long campanhaId;

}
