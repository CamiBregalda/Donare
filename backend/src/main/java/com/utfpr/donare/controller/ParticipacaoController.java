package com.utfpr.donare.controller;

import com.utfpr.donare.dto.*;
import com.utfpr.donare.service.ParticipacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(path = "participacao")
@RestController
public class ParticipacaoController {

    private final ParticipacaoService participacaoService;

    @Operation(summary = "Cria uma nova participacao.", description = "Registra uma nova participacao no sistema com as informações fornecidas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Participacao criada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ParticipacaoResponseDTO.class))),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/participacoes", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ParticipacaoResponseDTO> saveParticipacao(@Valid @RequestBody ParticipacaoRequestDTO participacaoRequestDTO) {
        return new ResponseEntity<>(participacaoService.saveParticipacao(participacaoRequestDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Retorna todos as participações por campanha.",
            description = "Recupera uma lista de todos as participações por campanha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de participações retornada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ParticipacaoResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/campanhas/{idCampanha}/participacoes")
    public ResponseEntity<List<ParticipacaoResponseDTO>> listarParticipacoesPorCampanha(@PathVariable Long idCampanha) {

        List<ParticipacaoResponseDTO> participacoes = participacaoService.listarParticipacoesPorCampanha(idCampanha);
        return ResponseEntity.ok(participacoes);
    }


    @GetMapping("/campanhas/{idCampanha}/participacoes/{idParticipacao}")
    public ResponseEntity<ParticipacaoResponseDTO> buscarParticipacaoPorId(@PathVariable Long idCampanha, @PathVariable Long idParticipacao) {

        ParticipacaoResponseDTO participacao = participacaoService.buscarParticipacaoPorId(idCampanha, idParticipacao);
        return ResponseEntity.ok(participacao);
    }

    @Operation(summary = "Atualiza uma participacao existente.", description = "Atualiza as informações de uma participacao pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Participacao atualizada com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "Participacao não encontrada para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping(path = "/participacoes/{idParticipacao}")
    public ResponseEntity<Void> updateParticipacao(@PathVariable Long idParticipacao, @RequestBody ParticipacaoRequestDTO participacaoRequestDTO) {
        participacaoService.updateParticipacao(idParticipacao, participacaoRequestDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Deleta uma participacao.", description = "Exclui uma participacao do sistema pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Participacao deletada com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "404", description = "Participacao não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping(path = "/participacoes/{idParticipacao}")
    public ResponseEntity<Void> deleteParticipacao(@PathVariable Long idParticipacao) {
        participacaoService.deleteParticipacao(idParticipacao);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
