package com.utfpr.donare.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para requisição de autenticação de usuário pelo google (email e googleId).")
public class AuthGoogleRequestDTO {
    @Schema(description = "Endereço de e-mail do usuário.",
            example = "joao.silva@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @Schema(description = "Google Id do usuário.",
            example = "123456789",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O google Id é obrigatório.")
    private String googleId;
}
