package com.utfpr.donare.dto;

import com.utfpr.donare.domain.EmailType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Schema(description = "Requisição para envio de e-mail com template")
@NoArgsConstructor
public class EmailRequestDTO {

    @Schema(description = "E-mail do destinatário", example = "usuario@exemplo.com")
    private String email;

    @Schema(description = "Nome do destinatário (opcional se já estiver nas variáveis)", example = "Carlos")
    private String name;

    @Schema(description = "Variáveis que serão substituídas no corpo do template",
            example = "{\"name\": \"Carlos\", \"event\": \"Maratona Donare\"}")
    private Map<String, String> variables;

    @Schema(description = "Tipo de e-mail a ser enviado", example = "CERTIFICADO")
    private EmailType emailType;

    public EmailRequestDTO(String email, String name, Map<String, String> variables, EmailType emailType) {
        this.email = email;
        this.name = name;
        this.variables = variables;
        this.emailType = emailType;
    }
}
