package com.utfpr.donare.dto;

import com.utfpr.donare.domain.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Schema(description = "DTO para resposta de dados de usuário.")
@NoArgsConstructor
public class UserResponseDTO {

    @Schema(description = "ID único do usuário.", example = "1")
    private Long id;

    @Schema(description = "Nome completo ou razão social do usuário.", example = "João da Silva")
    private String nome;

    @Schema(description = "Endereço de e-mail do usuário.", example = "joao.silva@example.com")
    private String email;

    @Schema(description = "CPF (11 dígitos) ou CNPJ (14 dígitos) do usuário (somente números).", example = "12345678900")
    private String cpfOuCnpj;

    @Schema(description = "Tipo de usuário: 1 para Pessoa Física, 2 para Pessoa Jurídica.", example = "1")
    private Integer tipoUsuario;

    @Schema(description = "Indica se o usuário está ativo no sistema.", example = "true")
    private boolean ativo;

    @Schema(description = "Dados do endereço do usuário.")
    private EnderecoResponseDto idEndereco;

    @Schema(description = "Dados binários da mídia de perfil (imagem, por exemplo) em Base64.", type = "string", format = "byte")
    private byte[] midia;

    @Schema(description = "Tipo de conteúdo da mídia de perfil (ex: image/jpeg, image/png).", example = "image/jpeg")
    private String midiaContentType;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.nome = user.getNome();
        this.email = user.getEmail();
        this.cpfOuCnpj = user.getCpfOuCnpj();
        this.tipoUsuario = user.getTipoUsuario().getCodigo();
        this.ativo = user.isAtivo();
        this.idEndereco = user.getIdEndereco() != null ? new EnderecoResponseDto(user.getIdEndereco()) : null;
        this.midia = user.getMidia();
        this.midiaContentType = user.getMidiaContentType();
    }
}