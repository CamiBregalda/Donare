package com.utfpr.donare.controller;

import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.VoluntarioResponseDTO;
import com.utfpr.donare.service.CampanhaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/campanhas")
@Tag(name = "Campanhas", description = "Endpoints para gerenciamento de campanhas")
public class CampanhaController {
    private final CampanhaService campanhaService;

    @Autowired
    public CampanhaController(CampanhaService campanhaService) {
        this.campanhaService = campanhaService;
    }

    @Operation(summary = "Criar uma nova campanha",
            description = "Cria uma nova campanha com os dados fornecidos. O organizador é definido pelo email do usuário autenticado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Campanha criada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = CampanhaResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> criarCampanha(
            @Parameter(description = "Título da campanha", required = true)
            @RequestPart("titulo") String titulo,
            @Parameter(description = "Descrição da campanha")
            @RequestPart(value = "descricao", required = false) String descricao,
            @Parameter(description = "Categoria da campanha (ex: doação de roupas)")
            @RequestPart(value = "categoriaCampanha", required = false) String categoriaCampanha,
            @Parameter(description = "Endereço da campanha")
            @RequestPart(value = "endereco", required = false) String endereco,
            @Parameter(description = "Status da campanha")
            @RequestPart(value = "status", required = false) String status,
            @Parameter(description = "Tipo de certificado")
            @RequestPart(value = "tipoCertificado", required = false) String tipoCertificado,
            @Parameter(description = "Data de fim (formato: yyyy-MM-ddTHH:mm:ss), opcional")
            @RequestPart(value = "dt_fim", required = false) String dtFim,
            @Parameter(description = "Imagem de capa da campanha")
            @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        CampanhaRequestDTO campanhaRequestDTO = new CampanhaRequestDTO();
        campanhaRequestDTO.setTitulo(titulo);
        campanhaRequestDTO.setDescricao(descricao);
        campanhaRequestDTO.setCategoriaCampanha(categoriaCampanha);
        campanhaRequestDTO.setEndereco(endereco);
        campanhaRequestDTO.setStatus(status);
        campanhaRequestDTO.setTipoCertificado(tipoCertificado);

        if (dtFim != null && !dtFim.isEmpty()) {
            try {
                campanhaRequestDTO.setDt_fim(java.time.LocalDateTime.parse(dtFim));
            } catch (java.time.format.DateTimeParseException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        campanhaRequestDTO.setImagemCapa(imagemCapa);

        String organizadorEmail = obterMockOrganizadorEmail();
        CampanhaResponseDTO novaCampanha = campanhaService.criarCampanha(campanhaRequestDTO, organizadorEmail);

        return new ResponseEntity<>(novaCampanha, HttpStatus.CREATED);
    }

    @Operation(summary = "Listar campanhas disponíveis",
            description = "Retorna uma lista paginada de campanhas, com opções de filtragem por tipo e localidade, e ordenação.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de campanhas retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = CampanhaResponseDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<CampanhaResponseDTO>> listarCampanhas(
            @Parameter(description = "Tipo de campanha (ex: doação, feira de adoção)")
            @RequestParam(required = false) String tipo,
            @Parameter(description = "Localidade da campanha")
            @RequestParam(required = false) String localidade,
            @Parameter(description = "Número da página (começando em 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamanho da página")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Critério de ordenação (dt_inicio, dt_fim)")
            @RequestParam(defaultValue = "dt_inicio") String sort) {

        List<CampanhaResponseDTO> campanhas = campanhaService.listarCampanhas(tipo, localidade, page, size, sort);
        return ResponseEntity.ok(campanhas);
    }

    @Operation(summary = "Visualizar detalhes de uma campanha específica",
            description = "Retorna os detalhes completos de uma campanha específica pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Campanha retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = CampanhaResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CampanhaResponseDTO> buscarCampanhaPorId(
            @Parameter(description = "ID da campanha a ser visualizada", required = true)
            @PathVariable Long id) {

        CampanhaResponseDTO campanha = campanhaService.buscarCampanhaPorId(id);
        return ResponseEntity.ok(campanha);
    }

    @Operation(summary = "Atualizar uma campanha existente",
            description = "Atualiza os dados de uma campanha existente. Apenas os campos fornecidos serão modificados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Campanha atualizada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = CampanhaResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> atualizarCampanha(
            @Parameter(description = "ID da campanha a ser atualizada", required = true)
            @PathVariable Long id,
            @Parameter(description = "Título da campanha")
            @RequestPart(value = "titulo", required = false) String titulo,
            @Parameter(description = "Descrição da campanha")
            @RequestPart(value = "descricao", required = false) String descricao,
            @Parameter(description = "Categoria da campanha (ex: doação de roupas)")
            @RequestPart(value = "categoriaCampanha", required = false) String categoriaCampanha,
            @Parameter(description = "Endereço da campanha")
            @RequestPart(value = "endereco", required = false) String endereco,
            @Parameter(description = "Status da campanha")
            @RequestPart(value = "status", required = false) String status,
            @Parameter(description = "Tipo de certificado")
            @RequestPart(value = "tipoCertificado", required = false) String tipoCertificado,
            @Parameter(description = "Data de fim (formato: yyyy-MM-ddTHH:mm:ss), opcional")
            @RequestPart(value = "dt_fim", required = false) String dtFim,
            @Parameter(description = "Imagem de capa da campanha")
            @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        CampanhaRequestDTO campanhaRequestDTO = new CampanhaRequestDTO();
        campanhaRequestDTO.setTitulo(titulo);
        campanhaRequestDTO.setDescricao(descricao);
        campanhaRequestDTO.setCategoriaCampanha(categoriaCampanha);
        campanhaRequestDTO.setEndereco(endereco);
        campanhaRequestDTO.setStatus(status);
        campanhaRequestDTO.setTipoCertificado(tipoCertificado);

        if (dtFim != null && !dtFim.isEmpty()) {
            try {
                campanhaRequestDTO.setDt_fim(java.time.LocalDateTime.parse(dtFim));
            } catch (java.time.format.DateTimeParseException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        campanhaRequestDTO.setImagemCapa(imagemCapa);

        String organizadorEmail = obterMockOrganizadorEmail();
        CampanhaResponseDTO campanhaAtualizada = campanhaService.atualizarCampanha(id, campanhaRequestDTO, organizadorEmail);

        return ResponseEntity.ok(campanhaAtualizada);
    }

    @Operation(summary = "Deletar uma campanha",
            description = "Exclui uma campanha existente. Apenas o organizador da campanha pode realizar esta operação.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Campanha deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCampanha(
            @Parameter(description = "ID da campanha a ser deletada", required = true)
            @PathVariable Long id) {

        String organizadorEmail = obterMockOrganizadorEmail();
        campanhaService.deletarCampanha(id, organizadorEmail);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Adicionar mídia a uma campanha",
            description = "Adiciona ou atualiza a mídia (imagem de capa) de uma campanha existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mídia adicionada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @PostMapping(value = "/{id}/midia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> adicionarMidiaCampanha(
            @Parameter(description = "ID da campanha", required = true)
            @PathVariable Long id,
            @Parameter(description = "Arquivo de mídia", required = true)
            @RequestPart("midia") MultipartFile midia) {

        String organizadorEmail = obterMockOrganizadorEmail();
        campanhaService.adicionarMidiaCampanha(id, midia, organizadorEmail);

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Obter mídia de uma campanha",
            description = "Retorna a mídia (imagem de capa) de uma campanha específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mídia retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada ou sem mídia")
    })
    @GetMapping(value = "/{id}/midia")
    public ResponseEntity<byte[]> obterMidiaCampanha(
            @Parameter(description = "ID da campanha", required = true)
            @PathVariable Long id) {

        byte[] midia = campanhaService.obterMidiaCampanha(id);
        if (midia == null || midia.length == 0) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(midia, headers, HttpStatus.OK);
    }

    @Operation(summary = "Listar voluntários de uma campanha",
            description = "Retorna a lista de voluntários inscritos em uma campanha específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de voluntários retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = VoluntarioResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @GetMapping("/{id}/voluntarios")
    public ResponseEntity<List<VoluntarioResponseDTO>> listarVoluntariosPorCampanha(
            @Parameter(description = "ID da campanha", required = true)
            @PathVariable Long id) {

        List<VoluntarioResponseDTO> voluntarios = campanhaService.listarVoluntariosPorCampanha(id);
        return ResponseEntity.ok(voluntarios);
    }

    private String obterMockOrganizadorEmail() {
        return "organizador@exemplo.com";
    }
}

