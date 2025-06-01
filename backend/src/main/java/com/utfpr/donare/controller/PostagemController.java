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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/postagens")
@Tag(name = "Postagens", description = "Endpoints para gerenciamento de postagens")
public class PostagemController {

    @Autowired
    private PostagemService postagemService;

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

    @Operation(summary = "Visualizar uma postagem específica",
            description = "Retorna os detalhes de uma postagem específica pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Postagem retornada",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PostagemResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @GetMapping("/{idCampanha}/post/{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> buscarPostagemPorId(
            @Parameter(description = "ID da campanha", required = true) @PathVariable Long idCampanha,
            @Parameter(description = "ID da postagem a ser visualizada", required = true) @PathVariable Long idPostagem) {
        PostagemResponseDTO postagem = postagemService.buscarPostagemPorId(idCampanha, idPostagem);
        return ResponseEntity.ok(postagem);
    }

    @PutMapping(value = "/{idPostagem}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
    @DeleteMapping("/{idPostagem}")
    public ResponseEntity<Void> deletarPostagem(
            @Parameter(description = "ID da postagem", required = true) @PathVariable Long idPostagem) {
        String organizadorEmail = obterMockOrganizadorEmail();
        postagemService.deletarPostagem(idPostagem, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obter mídia de uma postagem",
            description = "Retorna o arquivo de mídia (imagem/vídeo) associado a uma postagem específica.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mídia retornada com sucesso",
                    content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada ou sem mídia associada")
    })
    @GetMapping("/{idPostagem}/midia")
    public ResponseEntity<byte[]> obterMidiaPostagem(
            @Parameter(description = "ID da postagem", required = true) @PathVariable Long idPostagem) {
        byte[] midiaBytes = postagemService.obterMidiaPostagem(idPostagem);
        if (midiaBytes == null || midiaBytes.length == 0) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(midiaBytes, headers, HttpStatus.OK);
    }

    @Operation(summary = "Adicionar ou substituir mídia de uma postagem",
            description = "Faz upload de um arquivo de mídia (imagem/vídeo) para uma postagem. Se já existir mídia, ela será substituída.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mídia adicionada/substituída com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: nenhum arquivo enviado)"),
            @ApiResponse(responseCode = "404", description = "Postagem não encontrada")
    })
    @PostMapping(value = "/{idPostagem}/midia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> adicionarMidiaPostagem(
            @Parameter(description = "ID da postagem", required = true) @PathVariable Long idPostagem,
            @Parameter(description = "Arquivo de mídia (imagem/vídeo)", required = true) @RequestPart("midia") MultipartFile midia) {

        if (midia == null || midia.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String organizadorEmail = obterMockOrganizadorEmail();
        postagemService.adicionarMidiaPostagem(idPostagem, midia, organizadorEmail);
        return ResponseEntity.ok().build();
    }
}

