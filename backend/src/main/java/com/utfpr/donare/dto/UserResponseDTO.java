package com.utfpr.donare.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para resposta de dados de usuário.")
public class UserResponseDTO {

    @Schema(description = "ID único do usuário.", example = "1")
    private Long id;

    @Schema(description = "Nome completo ou razão social do usuário.", example = "João da Silva")
    private String nome;

    @Schema(description = "Endereço de e-mail do usuário.", example = "joao.silva@example.com")
    private String email;

    @Schema(description = "CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário (somente números).", example = "12345678900")
    private String cpfOuCnpj;

    // todo validar se vai ser string
    private String fotoPerfil;
}