package com.utfpr.donare.controller;

import com.utfpr.donare.dto.NecessidadeRequestDTO;
import com.utfpr.donare.dto.NecessidadeResponseDTO;
import com.utfpr.donare.model.Necessidade;
import com.utfpr.donare.service.NecessidadeService;
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
@Tag(name = "Necessidades", description = "Endpoints para gerenciamento de necessidades de campanhas")
public class NecessidadeController {

    @Autowired
    private NecessidadeService necessidadeService;

    // criar necessidade --------------------------------------------------
    @Operation(summary = "Criar uma nova necessidade para uma campanha",
            description = "Cria uma nova necessidade associada a uma campanha específica. ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Necessidade criada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: campos obrigatórios ausentes ou URLs inválidas)"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })

    @PostMapping(value = "/campanhas/{idCampanha}/post", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NecessidadeResponseDTO> criarNecessidade(
            @Parameter(description = "ID da campanha à qual a necessidade será associada", required = true)
            @PathVariable Long idCampanha,
            @Parameter(description = "Dados da necessidade, incluindo nome, unidadeMedida, quantidadeNecessaria e quantidadeRecebida", required = true)
            @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO novaNecessidade = necessidadeService.criarNecessidade(idCampanha, necessidadeRequestDTO);
        return new ResponseEntity<>(novaNecessidade, HttpStatus.CREATED);
    }

    // listar necessidades --------------------------------------------------
    @Operation(summary = "Listar todas as necessidades de uma campanha",
            description = "Retorna uma lista de todas as necessidades associadas a uma campanha específica, ordenadas da mais recente para a mais antiga.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de necessidades retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @GetMapping("/campanhas/{idCampanha}/post")
    public ResponseEntity<List<NecessidadeResponseDTO>> listarNecessidadesPorCampanha(
            @Parameter(description = "ID da campanha para listar as necessidades", required = true)
            @PathVariable Long idCampanha) {
        List<NecessidadeResponseDTO> necessidades = necessidadeService.listarNecessidadesPorCampanha(idCampanha);
        return ResponseEntity.ok(necessidades);
    }

    // buscar necessidade por id --------------------------------------------------

    @Operation(summary = "Visualizar uma necessidade específica de uma campanha",
            description = "Retorna os detalhes completos de uma necessidade específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Necessidade retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha ou Necessidade não encontrada")
    })
    @GetMapping("/campanhas/{idCampanha}/post/{idNecessidade}")
    public ResponseEntity<NecessidadeResponseDTO> buscarNecessidadePorId(
            @Parameter(description = "ID da campanha", required = true) @PathVariable Long idCampanha,
            @Parameter(description = "ID da necessidade a ser visualizada", required = true) @PathVariable Long idNecessidade) {
        NecessidadeResponseDTO necessidade = necessidadeService.buscarNecessidadePorId(idCampanha, idNecessidade);
        return ResponseEntity.ok(necessidade);
    }


    // editar necessidade --------------------------------------------------

    @Operation(summary = "Editar uma necessidade existente",
            description = "Atualiza o nome, unidadeMedida, quantidadeNecessaria e quantidadeRecebida de uma necessidade existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Necessidade atualizada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Necessidade não encontrada")
    })
    @PutMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<NecessidadeResponseDTO> editarNecessidade(
            @Parameter(description = "ID da necessidade a ser editada", required = true) @PathVariable Long idNecessidade,
            @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO necessidadeAtualizada = necessidadeService.editarNecessidade(idNecessidade, necessidadeRequestDTO);
        return ResponseEntity.ok(necessidadeAtualizada);
    }

    // deletar necessidade --------------------------------------------------

    @Operation(summary = "Deletar uma necessidade",
            description = "Exclui uma necessidade existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Necessidade deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Necessidade não encontrada")
    })
    @DeleteMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<Void> deletarNecessidade(
            @Parameter(description = "ID da necessidade a ser deletada", required = true) @PathVariable Long idNecessidade) {

        necessidadeService.deletarNecessidade(idNecessidade);
        return ResponseEntity.noContent().build();
    }
}
