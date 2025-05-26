package com.utfpr.donare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioRequestDTO {

    @Size(max = 500, message = "O comentário deve ter no máximo 500 caracteres.")
    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;

    @NotBlank(message = "O e-mail do usuário é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    private String userEmail;

    //pode ser null
    private Long idComentarioPai;
}
