package com.utfpr.donare.controller;

import com.utfpr.donare.dto.*;
import com.utfpr.donare.service.ParticipacaoService;
import com.utfpr.donare.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(path = "participacao")
@RestController
public class ParticipacaoController {

    private final ParticipacaoService participacaoService;

    @PostMapping(value = "/participacoes", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ParticipacaoResponseDTO> saveParticipacao(@Valid @RequestBody ParticipacaoRequestDTO participacaoRequestDTO) {
        return new ResponseEntity<>(participacaoService.saveParticipacao(participacaoRequestDTO), HttpStatus.CREATED);
    }

    @GetMapping("/campanhas/{idCampanha}/participacoes")
    public ResponseEntity<List<ParticipacaoResponseDTO>> listarParticipacoesPorCampanha(@PathVariable Long idCampanha) {

        List<ParticipacaoResponseDTO> participacoes = participacaoService.listarParticipacoesPorCampanha(idCampanha);
        return ResponseEntity.ok(participacoes);
    }


    @GetMapping("/campanhas/{idCampanha}/participacoes/{idParticipacao}")
    public ResponseEntity<ParticipacaoResponseDTO> buscarParticipacaoPorId(@PathVariable Long idCampanha, @PathVariable Long idParticipacao) {

        ParticipacaoResponseDTO participacao = participacaoService.buscarParticipacaoPorId(idCampanha, idParticipacao);
        return ResponseEntity.ok(participacao);
    }

    @PutMapping(path = "/participacoes/{idParticipacao}")
    public ResponseEntity<Void> updateParticipacao(@PathVariable Long idParticipacao, @RequestBody ParticipacaoRequestDTO participacaoRequestDTO) {
        participacaoService.updateParticipacao(idParticipacao, participacaoRequestDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = "/participacoes/{idParticipacao}")
    public ResponseEntity<Void> deleteParticipacao(@PathVariable Long idParticipacao) {
        participacaoService.deleteParticipacao(idParticipacao);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
