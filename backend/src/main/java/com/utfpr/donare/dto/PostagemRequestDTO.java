package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostagemRequestDTO {

    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;

    private MultipartFile midia;
}
