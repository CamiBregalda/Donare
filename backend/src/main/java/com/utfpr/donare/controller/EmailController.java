package com.utfpr.donare.controller;

import com.utfpr.donare.dto.EmailRequestDTO;
import com.utfpr.donare.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
@Tag(name = "E-mails", description = "Endpoints para envio de e-mails baseados em templates")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @Operation(
            summary = "Enviar e-mail com base em um template",
            description = "Envia um e-mail para o destinatário informado, com base no tipo de e-mail e nas variáveis informadas.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = EmailRequestDTO.class),
                            examples = @ExampleObject(
                                    name = "Exemplo de envio de e-mail",
                                    value = """
                                                {
                                                  "email": "usuario@exemplo.com",
                                                  "name": "Carlos",
                                                  "emailType": "CERTIFICADO",
                                                  "variables": {
                                                    "name": "Carlos",
                                                    "event": "Maratona Donare"
                                                  }
                                                }
                                            """
                            )
                    )
            )
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "E-mail enviado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro ao enviar e-mail")
    })
    @PostMapping(path = "send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestDTO request) {

        try {

            emailService.sendEmail(request);

            return ResponseEntity.ok("E-mail enviado com sucesso!");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar e-mail");
        }
    }
}
