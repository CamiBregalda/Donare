package com.utfpr.donare.controller;

import com.utfpr.donare.domain.enums.CategoriaEnum;
import com.utfpr.donare.domain.enums.TipoCertificadoEnum;
import com.utfpr.donare.dto.*;
import com.utfpr.donare.service.CampanhaService;
import com.utfpr.donare.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;



@RestController
@RequestMapping("/campanhas")
@RequiredArgsConstructor
public class CampanhaController {

    private final CampanhaService campanhaService;
    private final QRCodeService qrCodeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> save(
            @RequestPart("campanha") CampanhaRequestDTO campanhaRequestDTO,
            @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        String organizadorEmail = getOrganizadorEmail();
        CampanhaResponseDTO novaCampanha = campanhaService.criarCampanha(campanhaRequestDTO, imagemCapa, organizadorEmail);
        return new ResponseEntity<>(novaCampanha, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CampanhaResponseDTO>> findAll(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String localidade,
            @RequestParam(required = false) String usuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dtInicio") String sort) {

        List<CampanhaResponseDTO> campanhas = campanhaService.listarCampanhas(tipo, localidade, usuario, page, size, sort);
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

        String organizadorEmail = getOrganizadorEmail();
        CampanhaResponseDTO campanhaAtualizada = campanhaService.atualizarCampanha(id, campanhaRequestDTO, imagemCapa, organizadorEmail);
        return ResponseEntity.ok(campanhaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        String organizadorEmail = getOrganizadorEmail();
        campanhaService.deletarCampanha(id, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/voluntarios")
    public ResponseEntity<List<VoluntarioResponseDTO>> listVolunteersByCampaign(@PathVariable Long id) {
        List<VoluntarioResponseDTO> voluntarios = campanhaService.listarVoluntariosPorCampanha(id);
        return ResponseEntity.ok(voluntarios);
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> listarTiposCampanha() {
        List<String> tipos = Arrays.stream(CategoriaEnum.values())
                .map(CategoriaEnum::getDescricao)
                .toList();

        return ResponseEntity.ok(tipos);
    }

    @GetMapping("/certificados")
    public ResponseEntity<List<String>> listarTiposCertificado() {
        List<String> tipos = Arrays.stream(TipoCertificadoEnum.values())
                .map(TipoCertificadoEnum::getDescricao)
                .toList();

        return ResponseEntity.ok(tipos);
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getQRCode(@PathVariable Long id) {
        CampanhaResponseDTO campanha = campanhaService.buscarCampanhaPorId(id);

        String data = "https://donare.com/campanha/" + id;
        byte[] qrCodeImage;
        try {
            qrCodeImage = qrCodeService.gerarQRCode(data, 300, 300);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(qrCodeImage, headers, HttpStatus.OK);
    }

    private String getOrganizadorEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
