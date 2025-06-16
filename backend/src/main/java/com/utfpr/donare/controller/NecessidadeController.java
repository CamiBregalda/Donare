package com.utfpr.donare.controller;

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

    @PostMapping(value = "/campanhas/{idCampanha}/necessidade", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NecessidadeResponseDTO> saveNecessidade(@PathVariable Long idCampanha, @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO novaNecessidade = necessidadeService.saveNecessidade(idCampanha, necessidadeRequestDTO);
        return new ResponseEntity<>(novaNecessidade, HttpStatus.CREATED);
    }

    // listar necessidades --------------------------------------------------

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


    @PutMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<NecessidadeResponseDTO> updateNecessidade(@PathVariable Long idNecessidade, @Valid @RequestBody NecessidadeRequestDTO necessidadeRequestDTO) {

        NecessidadeResponseDTO necessidadeAtualizada = necessidadeService.updateNecessidade(idNecessidade, necessidadeRequestDTO);
        return ResponseEntity.ok(necessidadeAtualizada);
    }

    // deletar necessidade --------------------------------------------------


    @DeleteMapping("/necessidades/{idNecessidade}")
    public ResponseEntity<Void> deleteNecessidade(@PathVariable Long idNecessidade) {

        necessidadeService.deleteNecessidade(idNecessidade);
        return ResponseEntity.noContent().build();
    }
}
