package com.utfpr.donare.controller;

import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import com.utfpr.donare.dto.ErrorResponse;
import com.utfpr.donare.service.ComentarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("comentario")
@RequiredArgsConstructor

public class ComentarioController {

    private final ComentarioService comentarioService;

    // criar comentario --------------------------------------------------
    @Operation(summary = "Cria um novo comentário em determinada campanha.", description = "Registra um novo comentário em determinada campanha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comentário criado com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos, e-mail/CPF/CNPJ já cadastrado, formato inválido).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/campanhas/{idCampanha}/comentarios", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ComentarioResponseDTO> saveComentario(@PathVariable Long idCampanha, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO novoComentario = comentarioService.saveComentario(idCampanha, comentarioRequestDTO);
        return new ResponseEntity<>(novoComentario, HttpStatus.CREATED);
    }

    // listar comentarios --------------------------------------------------

    @Operation(summary = "Retorna todos os comentários de determinada campanha.",
            description = "Recupera uma lista de todos os comentários de determinada campanha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de comentários retornada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/campanhas/{idCampanha}/comentarios")
    public ResponseEntity<List<ComentarioResponseDTO>> listarComentariosPorCampanha( @PathVariable Long idCampanha) {

        List<ComentarioResponseDTO> comentarios = comentarioService.listarComentariosPorCampanha(idCampanha);
        return ResponseEntity.ok(comentarios);
    }

    // buscar comentario por id --------------------------------------------------

    @GetMapping("/campanhas/{idCampanha}/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> buscarComentarioPorId(@PathVariable Long idCampanha, @PathVariable Long idComentario) {

        ComentarioResponseDTO comentario = comentarioService.buscarComentarioPorId(idCampanha, idComentario);
        return ResponseEntity.ok(comentario);
    }


    // editar comentario --------------------------------------------------
    @Operation(summary = "Atualiza um comentário existente.", description = "Atualiza as informações de um comentário específico pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comentário atualizado com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "Comentário não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> updateComentario( @PathVariable Long idComentario, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO comentarioAtualizado = comentarioService.updateComentario(idComentario, comentarioRequestDTO);
        return ResponseEntity.ok(comentarioAtualizado);
    }

    // deletar comentario --------------------------------------------------

    @Operation(summary = "Deleta um comentário.", description = "Exclui um comentário do sistema pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comentário deletado com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "404", description = "Comentário não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/comentarios/{idComentario}")
    public ResponseEntity<Void> deleteComentario(@PathVariable Long idComentario, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        comentarioService.deleteComentario(idComentario, comentarioRequestDTO);
        return ResponseEntity.noContent().build();
    }
}
