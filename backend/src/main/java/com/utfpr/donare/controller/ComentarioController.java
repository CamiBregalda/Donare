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
@RequestMapping("comentario")
@RequiredArgsConstructor

public class ComentarioController {

    private final ComentarioService comentarioService;

    // criar comentario --------------------------------------------------

    @PostMapping(value = "/campanhas/{idCampanha}/comentarios", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ComentarioResponseDTO> saveComentario(@PathVariable Long idCampanha, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO novoComentario = comentarioService.saveComentario(idCampanha, comentarioRequestDTO);
        return new ResponseEntity<>(novoComentario, HttpStatus.CREATED);
    }

    // listar comentarios --------------------------------------------------

    @GetMapping("/campanhas/{idCampanha}/comentarios")
    public ResponseEntity<List<ComentarioResponseDTO>> listarComentariosPorCampanha( @PathVariable Long idCampanha) {

        List<ComentarioResponseDTO> comentarios = comentarioService.listarComentariosPorCampanha(idCampanha);
        return ResponseEntity.ok(comentarios);
    }

    // buscar comentario por id --------------------------------------------------

    @GetMapping("/campanhas/{idCampanha}/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> buscarComentarioPorId(@PathVariable Long idCampanha, @PathVariable Long idComentario) {

        ComentarioResponseDTO comentario = comentarioService.buscarComentarioPorId(idCampanha, idComentario);
        return ResponseEntity.ok(comentario);
    }


    // editar comentario --------------------------------------------------

    @PutMapping("/comentarios/{idComentario}")
    public ResponseEntity<ComentarioResponseDTO> updateComentario( @PathVariable Long idComentario, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        ComentarioResponseDTO comentarioAtualizado = comentarioService.updateComentario(idComentario, comentarioRequestDTO);
        return ResponseEntity.ok(comentarioAtualizado);
    }

    // deletar comentario --------------------------------------------------


    @DeleteMapping("/comentarios/{idComentario}")
    public ResponseEntity<Void> deleteComentario(@PathVariable Long idComentario, @Valid @RequestBody ComentarioRequestDTO comentarioRequestDTO) {

        comentarioService.deleteComentario(idComentario, comentarioRequestDTO);
        return ResponseEntity.noContent().build();
    }
}
