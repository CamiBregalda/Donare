package com.utfpr.donare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacaoResponseDTO {
    private Long id;
    private Long campanhaId;
    private String tituloCampanha;
    private Long userId;
    private String nomeUsuario;
    private LocalDateTime dataHoraParticipacao;
}
