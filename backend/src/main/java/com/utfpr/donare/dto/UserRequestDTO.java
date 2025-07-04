package com.utfpr.donare.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "DTO para requisição de criação ou atualização de um usuário.")
public class UserRequestDTO {

    @Schema(description = "Nome completo ou razão social do usuário.",
            example = "João da Silva",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
    private String nome;

    @Schema(description = "Endereço de e-mail do usuário, deve ser único.",
            example = "joao.silva@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @Schema(description = "CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário. Somente números.",
            example = "12345678900",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "CPF ou CNPJ é obrigatório.")
    @Pattern(regexp = "\\d{11}|\\d{14}", message = "CPF deve ter 11 dígitos ou CNPJ 14 dígitos (somente números).")
    private String cpfOuCnpj;

    @Schema(description = "Se o usuário é pessoa física ou jurídica",
            example = "1 = FISICA, 2 = JURIDICA",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "O tipo de usuário é obrigatório.")
    private Integer tipoUsuario;

    @Schema(description = "Dados do endereço do usuário.",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "O endereço é obrigatório.")
    @Valid
    private EnderecoRequestDto endereco;

    @Schema(description = "Senha do usuário. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
            example = "Senha@123",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "A senha é obrigatória.")
    private String password;
}