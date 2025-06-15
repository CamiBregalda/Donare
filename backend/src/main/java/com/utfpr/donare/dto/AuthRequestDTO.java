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
@Schema(description = "DTO para requisição de autenticação de usuário (email e senha).")
public class AuthRequestDTO {

    @Schema(description = "Endereço de e-mail do usuário.",
            example = "joao.silva@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @Schema(description = "Senha do usuário.",
            example = "Senha@123",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "A senha é obrigatória.")
    private String password;
}