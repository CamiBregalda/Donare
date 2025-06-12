package com.utfpr.donare.controller;

import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.VoluntarioResponseDTO;
import com.utfpr.donare.service.CampanhaService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;



@RestController
@RequestMapping("/campanhas")
@RequiredArgsConstructor
public class CampanhaController {

    private final CampanhaService campanhaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> save(
            @RequestPart("campanha") CampanhaRequestDTO campanhaRequestDTO,
            @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        String organizadorEmail = obterMockOrganizadorEmail();
        CampanhaResponseDTO novaCampanha = campanhaService.criarCampanha(campanhaRequestDTO, imagemCapa, organizadorEmail);
        return new ResponseEntity<>(novaCampanha, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CampanhaResponseDTO>> findAll(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String localidade,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dt_inicio") String sort) {

        List<CampanhaResponseDTO> campanhas = campanhaService.listarCampanhas(tipo, localidade, page, size, sort);
        return ResponseEntity.ok(campanhas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanhaResponseDTO> findById(@PathVariable Long id) {
        CampanhaResponseDTO campanha = campanhaService.buscarCampanhaPorId(id);
        return ResponseEntity.ok(campanha);
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> getImagemCapa(@PathVariable Long id) {
        byte[] imagemBytes = campanhaService.obterImagemCapa(id);
        String contentType = campanhaService.obterImagemCapaContentType(id);

        if (imagemBytes == null || imagemBytes.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE));

        return new ResponseEntity<>(imagemBytes, headers, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("campanha") CampanhaRequestDTO campanhaRequestDTO,
            @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        String organizadorEmail = obterMockOrganizadorEmail();
        CampanhaResponseDTO campanhaAtualizada = campanhaService.atualizarCampanha(id, campanhaRequestDTO, imagemCapa, organizadorEmail);
        return ResponseEntity.ok(campanhaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        String organizadorEmail = obterMockOrganizadorEmail();
        campanhaService.deletarCampanha(id, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/voluntarios")
    public ResponseEntity<List<VoluntarioResponseDTO>> listVolunteersByCampaign(@PathVariable Long id) {
        List<VoluntarioResponseDTO> voluntarios = campanhaService.listarVoluntariosPorCampanha(id);
        return ResponseEntity.ok(voluntarios);
    }

    private String obterMockOrganizadorEmail() {
        return "organizador@exemplo.com";
    }
}
