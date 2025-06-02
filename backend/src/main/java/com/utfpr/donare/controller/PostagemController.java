package com.utfpr.donare.controller;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import com.utfpr.donare.service.PostagemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/postagens" )
@RequiredArgsConstructor
public class PostagemController {

    private final PostagemService postagemService;

    private String obterMockOrganizadorEmail() {
        return "mock.organizador@example.com";
    }

    @PostMapping(value = "/campanhas/{idCampanha}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostagemResponseDTO> save(
            @PathVariable Long idCampanha,
            @RequestPart("postagem") PostagemRequestDTO postagemRequestDTO,
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        String organizadorEmail = obterMockOrganizadorEmail();
        PostagemResponseDTO novaPostagem = postagemService.criarPostagem(idCampanha, postagemRequestDTO, midia, organizadorEmail);
        return new ResponseEntity<>(novaPostagem, HttpStatus.CREATED);
    }

    @GetMapping("/campanhas/{idCampanha}")
    public ResponseEntity<List<PostagemResponseDTO>> findAllByCampaign(@PathVariable Long idCampanha) {
        List<PostagemResponseDTO> postagens = postagemService.listarPostagensPorCampanha(idCampanha);
        return ResponseEntity.ok(postagens);
    }

    @GetMapping("/{idPostagem}")
    public ResponseEntity<PostagemResponseDTO> findById(@PathVariable Long idPostagem)  {
        PostagemResponseDTO postagem = postagemService.buscarPostagemPorId(idPostagem);
        return ResponseEntity.ok(postagem);
    }

    @PutMapping(value = "/{idPostagem}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostagemResponseDTO> update(
            @PathVariable Long idPostagem,
            @RequestPart("postagem") PostagemRequestDTO postagemRequestDTO,
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        String organizadorEmail = obterMockOrganizadorEmail();
        PostagemResponseDTO postagemAtualizada = postagemService.editarPostagem(idPostagem, postagemRequestDTO, midia, organizadorEmail);
        return ResponseEntity.ok(postagemAtualizada);
    }

    @DeleteMapping("/{idPostagem}")
    public ResponseEntity<Void> delete(@PathVariable Long idPostagem) {
        String organizadorEmail = obterMockOrganizadorEmail();
        postagemService.deletarPostagem(idPostagem, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idPostagem}/midia")
    public ResponseEntity<byte[]> getMedia(@PathVariable Long idPostagem) {
        byte[] midiaBytes = postagemService.obterMidiaPostagem(idPostagem);
        String contentType = postagemService.obterMidiaContentType(idPostagem);

        if (midiaBytes == null || midiaBytes.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE));

        return new ResponseEntity<>(midiaBytes, headers, HttpStatus.OK);
    }
}
