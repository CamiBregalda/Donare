package com.utfpr.donare.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "DTO para solicitar informações de endereço.")
public class EnderecoRequestDto {

    @Schema(description = "ID único do endereço (usado principalmente para atualização).",
            example = "123",
            nullable = true)
    private Long id;

    @Schema(description = "Nome do logradouro (rua, avenida, etc.).",
            example = "Rua das Flores",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O logradouro é obrigatório.")
    @Size(min = 3, max = 100, message = "O logradouro deve ter entre 3 e 100 caracteres.")
    private String logradouro;

    @Schema(description = "Nome do complemento (apto, etc.).",
            example = "Apto 18",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O complemento é obrigatório.")
    @Size(min = 3, max = 100, message = "O complemento deve ter entre 3 e 100 caracteres.")
    private String complemento;

    @Schema(description = "Nome do bairro.",
            example = "Centro",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O bairro é obrigatório.")
    @Size(min = 3, max = 50, message = "O bairro deve ter entre 3 e 50 caracteres.")
    private String bairro;

    @Schema(description = "Número do imóvel.",
            example = "100",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O número é obrigatório.")
    @Size(max = 10, message = "O número deve ter no máximo 10 caracteres.")
    private String numero;

    @Schema(description = "Nome da cidade.",
            example = "Curitiba",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "A cidade é obrigatória.")
    @Size(min = 3, max = 50, message = "A cidade deve ter entre 3 e 50 caracteres.")
    private String cidade;

    @Schema(description = "Sigla do estado do Brasil (ex: PR, SP, RJ).",
            example = "PR",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O estado é obrigatória.")
    @Size(min = 2, max = 2, message = "O estado deve ter 2 caracteres.")
    private String estado;

    @Schema(description = "Sigla do CEP (ex: 00000000000).",
            example = "85660000",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "O CEP é obrigatória.")
    @Size(min = 8, max = 20, message = "O CEP deve ter no mínimo 8 caracteres.")
    private String cep;
}