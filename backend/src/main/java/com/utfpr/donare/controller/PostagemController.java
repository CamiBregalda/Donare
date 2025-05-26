package com.utfpr.donare.controller;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import com.utfpr.donare.service.PostagemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("postagem")
@RequiredArgsConstructor
@Tag(name = "Postagens", description = "Endpoints para gerenciamento de postagens de campanhas")
public class PostagemController {

    private final PostagemService postagemService;

    private String obterMockOrganizadorEmail() {
        return "mock.organizador@example.com";
    }

    @Operation(summary = "Criar uma nova postagem para uma campanha",
            description = "Cria uma nova postagem associada a uma campanha específica. A mídia deve ser enviada como arquivo via form-data.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Postagem criada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PostagemResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: campos obrigatórios ausentes)"),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @PostMapping(value = "/campanhas/{idCampanha}/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostagemResponseDTO> criarPostagem(
            @Parameter(description = "ID da campanha à qual a postagem será associada", required = true)
            @PathVariable Long idCampanha,
            @Parameter(description = "Título da postagem", required = true)
            @RequestPart("titulo") String titulo,
            @Parameter(description = "Conteúdo da postagem", required = true)
            @RequestPart("conteudo") String conteudo,
            @Parameter(description = "Arquivo de mídia (opcional)")
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        PostagemRequestDTO postagemRequestDTO = new PostagemRequestDTO();
        postagemRequestDTO.setTitulo(titulo);
        postagemRequestDTO.setConteudo(conteudo);
        postagemRequestDTO.setMidia(midia);

        String organizadorEmail = obterMockOrganizadorEmail();
        PostagemResponseDTO novaPostagem = postagemService.criarPostagem(idCampanha, postagemRequestDTO, organizadorEmail);
        return new ResponseEntity<>(novaPostagem, HttpStatus.CREATED);
    }

    @Operation(summary = "Listar todas as postagens de uma campanha",
            description = "Retorna uma lista de todas as postagens associadas a uma campanha específica, ordenadas da mais recente para a mais antiga.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de postagens retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PostagemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha não encontrada")
    })
    @GetMapping("/campanhas/{idCampanha}/post")
    public ResponseEntity<List<PostagemResponseDTO>> listarPostagensPorCampanha(
            @Parameter(description = "ID da campanha para listar as postagens", required = true)
            @PathVariable Long idCampanha) {
        List<PostagemResponseDTO> postagens = postagemService.listarPostagensPorCampanha(idCampanha);
        return ResponseEntity.ok(postagens);
    }

    @Operation(summary = "Visualizar uma postagem específica de uma campanha",
            description = "Retorna os detalhes completos de uma postagem específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Postagem retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PostagemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Campanha ou Postagem não encontrada")
    })
    @GetMapping("/campanhas/{idCampanha}/post/{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> buscarPostagemPorId(
            @Parameter(description = "ID da campanha", required = true) @PathVariable Long idCampanha,
            @Parameter(description = "ID da postagem a ser visualizada", required = true) @PathVariable Long idPostagem) {
        PostagemResponseDTO postagem = postagemService.buscarPostagemPorId(idCampanha, idPostagem);
        return ResponseEntity.ok(postagem);
    }

    @Operation(summary = "Editar uma postagem existente",
            description = "Atualiza o título, conteúdo e/ou mídia de uma postagem existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Postagem atualizada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PostagemResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @PutMapping(value = "/postagens/{idPostagem}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostagemResponseDTO> editarPostagem(
            @Parameter(description = "ID da postagem a ser editada", required = true) @PathVariable Long idPostagem,
            @Parameter(description = "Título da postagem", required = true)
            @RequestPart("titulo") String titulo,
            @Parameter(description = "Conteúdo da postagem", required = true)
            @RequestPart("conteudo") String conteudo,
            @Parameter(description = "Arquivo de mídia (opcional - se não fornecido, mantém a mídia atual)")
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        PostagemRequestDTO postagemRequestDTO = new PostagemRequestDTO();
        postagemRequestDTO.setTitulo(titulo);
        postagemRequestDTO.setConteudo(conteudo);
        postagemRequestDTO.setMidia(midia);

        String organizadorEmail = obterMockOrganizadorEmail();
        PostagemResponseDTO postagemAtualizada = postagemService.editarPostagem(idPostagem, postagemRequestDTO, organizadorEmail);
        return ResponseEntity.ok(postagemAtualizada);
    }

    @Operation(summary = "Deletar uma postagem",
            description = "Exclui uma postagem existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Postagem deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @DeleteMapping("/postagens/{idPostagem}")
    public ResponseEntity<Void> deletarPostagem(
            @Parameter(description = "ID da postagem a ser deletada", required = true) @PathVariable Long idPostagem) {
        String organizadorEmail = obterMockOrganizadorEmail();
        postagemService.deletarPostagem(idPostagem, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

}