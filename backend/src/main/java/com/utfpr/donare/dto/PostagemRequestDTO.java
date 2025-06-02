package com.utfpr.donare.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
// import org.springframework.web.multipart.MultipartFile; // Removido
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostagemRequestDTO {

    @NotNull(message = "O ID da campanha não pode ser nulo.")
    private Long idCampanha;

    @NotBlank(message = "O título não pode estar em branco.")
    private String titulo;

    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;

}
