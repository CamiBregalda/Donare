package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ParticipacaoRequestDTO {
    @NotNull(message = "O ID da campanha é obrigatório.")
    private Long campanhaId;

    @NotNull(message = "O ID do usuário é obrigatório.")
    private Long userId;
}
