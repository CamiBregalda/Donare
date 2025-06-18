package com.utfpr.donare.controller;

import com.utfpr.donare.dto.ErrorResponse;
import com.utfpr.donare.dto.NecessidadeRequestDTO;
import com.utfpr.donare.dto.NecessidadeResponseDTO;
import com.utfpr.donare.service.NecessidadeService;
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

//cors
   import org.springframework.context.annotation.Bean;
   import org.springframework.web.servlet.config.annotation.CorsRegistry;
   import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



   
@RestController
@RequestMapping("necessidade")
@RequiredArgsConstructor
public class NecessidadeController {

    private final NecessidadeService necessidadeService;

    // criar necessidade --------------------------------------------------

    @Operation(summary = "Cria uma nova necessidade em determinada campanha.", description = "Registra um nova necessidade em determinada campanha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Necessidade criada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(value = "/campanhas/{idCampanha}/necessidade", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NecessidadeResponseDTO> saveNecessidade(@PathVariable Long idCampanha, @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO novaNecessidade = necessidadeService.saveNecessidade(idCampanha, necessidadeRequestDTO);
        return new ResponseEntity<>(novaNecessidade, HttpStatus.CREATED);
    }

    // listar necessidades --------------------------------------------------

    @Operation(summary = "Retorna todas as necessidades por determinada campanha.",
            description = "Recupera uma lista de todas as necessidades por determinada campanha.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de necessidades retornada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = NecessidadeResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/campanhas/{idCampanha}/necessidades")
    public ResponseEntity<List<NecessidadeResponseDTO>> listarNecessidadesPorCampanha(@PathVariable Long idCampanha) {

        List<NecessidadeResponseDTO> necessidades = necessidadeService.listarNecessidadesPorCampanha(idCampanha);
        return ResponseEntity.ok(necessidades);
    }

    // buscar necessidade por id --------------------------------------------------

    @GetMapping("/campanhas/{idCampanha}/necessidades/{idNecessidade}")
    public ResponseEntity<NecessidadeResponseDTO> buscarNecessidadePorId(@PathVariable Long idCampanha, @PathVariable Long idNecessidade) {

        NecessidadeResponseDTO necessidade = necessidadeService.buscarNecessidadePorId(idCampanha, idNecessidade);
        return ResponseEntity.ok(necessidade);
    }


    // editar necessidade --------------------------------------------------

    @Operation(summary = "Atualiza uma necessidade existente.", description = "Atualiza as informações de uma necessidade específica pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Necessidade atualizada com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "Necessidade não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<NecessidadeResponseDTO> updateNecessidade(@PathVariable Long idNecessidade, @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO necessidadeAtualizada = necessidadeService.updateNecessidade(idNecessidade, necessidadeRequestDTO);
        return ResponseEntity.ok(necessidadeAtualizada);
    }

    // deletar necessidade --------------------------------------------------

    @Operation(summary = "Deleta uma necessidade.", description = "Exclui uma necessidade do sistema pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Necessidade deletada com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "404", description = "Necessidade não encontrada para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<Void> deleteNecessidade(@PathVariable Long idNecessidade) {

        necessidadeService.deleteNecessidade(idNecessidade);
        return ResponseEntity.noContent().build();
    }
}
