package com.utfpr.donare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
// import org.springframework.web.multipart.MultipartFile; // Removido

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampanhaRequestDTO {
    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
    private String titulo;

    private String descricao;

    private String categoriaCampanha;

    private String endereco;

    private String status;

    private String tipoCertificado;

    private LocalDateTime dt_fim;
}
