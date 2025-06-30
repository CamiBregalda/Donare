package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Endereco;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Schema(description = "DTO para resposta de dados de endereço.")
@AllArgsConstructor
@NoArgsConstructor
public class EnderecoResponseDto {

    @Schema(description = "ID único do endereço.", example = "101")
    private Long id;

    @Schema(description = "Logradouro do endereço.", example = "Rua das Flores")
    private String logradouro;

    @Schema(description = "Número do endereço.", example = "123")
    private String numero;

    @Schema(description = "Complemento do endereço.", example = "Apto 45")
    private String complemento;

    @Schema(description = "Bairro do endereço.", example = "Centro")
    private String bairro;

    @Schema(description = "Cidade do endereço.", example = "Florianópolis")
    private String cidade;

    @Schema(description = "Estado do endereço.", example = "SC")
    private String estado;

    @Schema(description = "CEP do endereço.", example = "88000-000")
    private String cep;
}