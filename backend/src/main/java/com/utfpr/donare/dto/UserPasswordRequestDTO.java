package com.utfpr.donare.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "DTO para requisição atualização da senha de um usuário.")
public class UserPasswordRequestDTO {

    @Schema(description = "Senha antiga do usuário. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
            example = "Senha@123",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "A senha antiga é obrigatória.")
    private String oldPassword;

    @Schema(description = "Senha nova do usuário. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.",
            example = "Senha@123",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "A senha nova é obrigatória.")
    private String newPassword;
}
