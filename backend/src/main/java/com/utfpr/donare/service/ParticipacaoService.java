package com.utfpr.donare.service;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Necessidade;
import com.utfpr.donare.domain.Participacao;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.*;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.mapper.CampanhaMapper;
import com.utfpr.donare.mapper.ParticipacaoMapper;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository. ParticipacaoRepository;
import com.utfpr.donare.repository.UserRepository;
import jakarta.mail.Part;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipacaoService {

    private final ParticipacaoRepository participacaoRepository;
    private final ParticipacaoMapper participacaoMapper;
    private final CampanhaRepository campanhaRepository;
    private final UserRepository userRepository;
    private final CampanhaMapper campanhaMapper;

    @Transactional
    public ParticipacaoResponseDTO saveParticipacao(ParticipacaoRequestDTO participacaoRequestDTO) {

        Campanha campanha = campanhaRepository.findById(participacaoRequestDTO.getCampanhaId())
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + participacaoRequestDTO.getCampanhaId()));

        User user = userRepository.findById(participacaoRequestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrada com o id: " + participacaoRequestDTO.getUserId()));

        Participacao participacao = Participacao.builder()
                .campanha(campanha)
                .user(user)
                .build();

        participacaoRepository.save(participacao);

        return  converterParaResponseDTO(participacao);
    }

    public List<ParticipacaoResponseDTO> listarParticipacoesPorCampanha(Long idCampanha) {
        if (!campanhaRepository.existsById(idCampanha)) {
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }

        List<Participacao> participacoes = participacaoRepository.findByCampanhaId(idCampanha);

        return participacoes.stream()
                .map(this::converterParaResponseDTO).collect(Collectors.toList());
    }

    public ParticipacaoResponseDTO buscarParticipacaoPorId(Long idCampanha, Long idParticipacao) {
        Participacao participacao = participacaoRepository.findById(idParticipacao)
                .orElseThrow(() -> new ResourceNotFoundException("Participacao não encontrada com o id: " + idParticipacao));

        if (!participacao.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Participacao com id " + idParticipacao + " não pertence à campanha com id " + idCampanha);
        }
        return converterParaResponseDTO(participacao);
    }

    @Transactional
    public Participacao updateParticipacao(Long idParticipacao, ParticipacaoRequestDTO participacaoRequestDTO) {

        Campanha campanha = campanhaRepository.findById(participacaoRequestDTO.getCampanhaId())
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + participacaoRequestDTO.getCampanhaId()));

        User user = userRepository.findById(participacaoRequestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrada com o id: " + participacaoRequestDTO.getUserId()));

        Participacao participacao = participacaoRepository.findById(idParticipacao).orElseThrow(() -> new RuntimeException("Participacao não encontrada"));
        participacao.setCampanha(campanha);
        participacao.setUser(user);


        return participacaoRepository.save(participacao);
    }

    @Transactional
    public void deleteParticipacao(Long idParticipacao) {
        participacaoRepository.deleteById(idParticipacao);
    }

    public List<CampanhaResponseDTO> findCampanhasParticipadasByIdUsuario(Long idUsuario) {

        return participacaoRepository.findByCampanhaId(idUsuario).stream()
                .map(participacao -> campanhaMapper.entityToResponseDto(participacao.getCampanha()))
                .collect(Collectors.toList());
    }

    private ParticipacaoResponseDTO converterParaResponseDTO(Participacao participacao) {
        Campanha campanha = participacao.getCampanha();
        User user = participacao.getUser();

        return new ParticipacaoResponseDTO(
                participacao.getId(),
                campanha.getId(),
                campanha.getTitulo(),
                user.getId(),
                user.getNome(),
                participacao.getDataHoraParticipacao()
        );
    }

}
