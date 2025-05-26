package com.utfpr.donare.controller;

import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import com.utfpr.donare.service.ComentarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Comentarios", description = "Endpoints para gerenciamento de comentarios de campanhas")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    // criar comentario --------------------------------------------------
    @Operation(summary = "Criar uma nova comentario para uma campanha",
            description = "Cria uma nova comentario associada a uma campanha específica. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comentario criado com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: campos obrigatórios ausentes ou URLs inválidas)"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })

    @PostMapping(value = "/campanhas/{idCampanha}/comentarios", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ComentarioResponseDTO> criarComentario(
            @Parameter(description = "ID da campanha à qual o comentário será associada", required = true)
            @PathVariable Long idCampanha,
            @Parameter(description = "Dados do comentario, incluindo conteudo, userEmail, idComentarioPai", required = true)
            @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO novoComentario = comentarioService.criarComentario(idCampanha, comentarioRequestDTO, comentarioRequestDTO.getUserEmail());
        return new ResponseEntity<>(novoComentario, HttpStatus.CREATED);
    }

    // listar comentarios --------------------------------------------------
    @Operation(summary = "Listar todas os comentarios de uma campanha",
            description = "Retorna uma lista de todas os comentarios associados a uma campanha específica, ordenados da mais recente para a mais antiga.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de comentarios retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @GetMapping("/campanhas/{idCampanha}/comentarios")
    public ResponseEntity<List<ComentarioResponseDTO>> listarComentariosPorCampanha(
            @Parameter(description = "ID da campanha para listar os comentarios", required = true)
            @PathVariable Long idCampanha) {
        List<ComentarioResponseDTO> comentarios = comentarioService.listarComentariosPorCampanha(idCampanha);
        return ResponseEntity.ok(comentarios);
    }

    // buscar comentario por id --------------------------------------------------

    @Operation(summary = "Visualizar um comentario específico de uma campanha",
            description = "Retorna os detalhes completos de um comentario específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentario retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha ou Comentario não encontrados")
    })
    @GetMapping("/campanhas/{idCampanha}/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> buscarComentarioPorId(
            @Parameter(description = "ID da campanha", required = true) @PathVariable Long idCampanha,
            @Parameter(description = "ID do comentario a ser visualizado", required = true) @PathVariable Long idComentario) {
        ComentarioResponseDTO comentario = comentarioService.buscarComentarioPorId(idCampanha, idComentario);
        return ResponseEntity.ok(comentario);
    }


    // editar comentario --------------------------------------------------

    @Operation(summary = "Editar um comentario existente",
            description = "Atualiza o conteúdo, userEmail, idComentarioPai")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentario atualizado com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ComentarioResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Comentario não encontrada")
    })
    @PutMapping("/campanhas/{idCampanha}/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> editarComentario(
            @Parameter(description = "ID do comentário a ser editado", required = true) @PathVariable Long idComentario,
            @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO comentarioAtualizado = comentarioService.editarComentario(idComentario, comentarioRequestDTO, comentarioRequestDTO.getUserEmail());
        return ResponseEntity.ok(comentarioAtualizado);
    }

    // deletar comentario --------------------------------------------------

    @Operation(summary = "Deletar um comentario",
            description = "Exclui um comentario existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comentario deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentario não encontrada")
    })
    @DeleteMapping("/campanhas/{idCampanha}/comentarios/{idComentario}")
    public ResponseEntity<Void> deletarComentario(
            @Parameter(description = "ID do comentario a ser deletado", required = true) @PathVariable Long idComentario, ComentarioRequestDTO comentarioRequestDTO) {

        comentarioService.deletarComentario(idComentario, comentarioRequestDTO.getUserEmail());
        return ResponseEntity.noContent().build();
    }
}
