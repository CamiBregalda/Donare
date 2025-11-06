package com.utfpr.donare.controller;

import com.utfpr.donare.domain.enums.CategoriaEnum;
import com.utfpr.donare.domain.enums.TipoCertificadoEnum;
import com.utfpr.donare.dto.*;
import com.utfpr.donare.service.interfaces.CampanhaService;
import com.utfpr.donare.service.QRCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
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
        CampanhaResponseDTO novaCampanha = campanhaService.saveCampanha(campanhaRequestDTO, imagemCapa, organizadorEmail);
        return new ResponseEntity<>(novaCampanha, HttpStatus.CREATED);
    }

    @GetMapping("/historico")
    public ResponseEntity<List<CampanhaResponseDTO>> findAllHistory(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String localidade,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dtInicio") String sort) {

        List<CampanhaResponseDTO> campanhas = campanhaService.ListCampaignHistory(tipo, localidade, usuario, titulo, page, size, sort);
        return ResponseEntity.ok(campanhas);
    }

    @GetMapping
    public ResponseEntity<List<CampanhaResponseDTO>> findAll(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String localidade,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String titulo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dtInicio") String sort) {

        List<CampanhaResponseDTO> campanhas = campanhaService.findCampanhas(tipo, localidade, usuario, titulo, page, size, sort);
        return ResponseEntity.ok(campanhas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanhaResponseDTO> findById(@PathVariable Long id) {
        CampanhaResponseDTO campanha = campanhaService.findCampanhaPorId(id);
        return ResponseEntity.ok(campanha);
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> getImagemCapa(@PathVariable Long id) {
        byte[] imagemBytes = campanhaService.getCoverImage(id);
        String contentType = campanhaService.getCoverImageContentType(id);

        if (imagemBytes == null || imagemBytes.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE));

        return new ResponseEntity<>(imagemBytes, headers, HttpStatus.OK);
    }

    @Operation(summary = "Atualiza uma campanha existente.", description = "Atualiza as informações de uma campanha específico pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Campanha atualizado com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "404", description = "Campanha não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaResponseDTO> update(
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            examples = @ExampleObject(
                                    value = """
                    {
                      "titulo": "Campanha de Doação de Cachorro!!",
                      "descricao": "Venha adotar seu melhor amigo!.",
                      "categoriaCampanha": "Solidariedade",
                      "endereco": {
                        "logradouro": "Rua das Flores",
                        "complemento": "Apto 18",
                        "bairro": "Centro",
                        "numero": "100",
                        "cidade": "Curitiba",
                        "estado": "PR",
                        "cep": "85660000"
                      },
                      "status": "ATIVA",
                      "tipoCertificado": "DIGITAL",
                      "dtInicio": "2025-09-28T21:51:14",
                      "dt_fim": "2025-12-28T21:51:14"
                    }
                    """
                            )
                    )
            )
            @Valid @RequestPart("campanha") CampanhaRequestDTO campanhaRequestDTO,
            @Valid @RequestPart(value = "imagemCapa", required = false) MultipartFile imagemCapa) {

        String organizadorEmail = getOrganizadorEmail();
        CampanhaResponseDTO campanhaAtualizada = campanhaService.updateCampanha(id, campanhaRequestDTO, imagemCapa, organizadorEmail);
        return ResponseEntity.ok(campanhaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        String organizadorEmail = getOrganizadorEmail();
        campanhaService.deleteCampanha(id, organizadorEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/voluntarios")
    public ResponseEntity<List<UserResponseDTO>> listVolunteersByCampaign(@PathVariable Long id) {
        List<UserResponseDTO> voluntarios = campanhaService.listVolunteersByCampaign(id);
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
        CampanhaResponseDTO campanha = campanhaService.findCampanhaPorId(id);

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

    @GetMapping("/proximas")
    public ResponseEntity<List<CampanhaDistanciaResponseDTO>> listarProximas(
            @RequestParam double lat,
            @RequestParam double lon) {

        List<CampanhaDistanciaResponseDTO> proximas = campanhaService.buscarCampanhasProximas(lat, lon);
        return ResponseEntity.ok(proximas);
    }

    private String getOrganizadorEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
