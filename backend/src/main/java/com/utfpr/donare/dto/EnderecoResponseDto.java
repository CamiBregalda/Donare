package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Endereco;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para resposta de dados de endereço.")
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

    public EnderecoResponseDto(Endereco endereco) {
        this.id = endereco.getId();
        this.logradouro = endereco.getLogradouro();
        this.numero = endereco.getNumero();
        this.complemento = endereco.getComplemento();
        this.bairro = endereco.getBairro();
        this.cidade = endereco.getCidade();
        this.estado = endereco.getEstado();
        this.cep = endereco.getCep();
    }
}