package com.utfpr.donare.service;

import com.utfpr.donare.dto.NecessidadeRequestDTO;
import com.utfpr.donare.dto.NecessidadeResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Necessidade;
import com.utfpr.donare.mapper.NecessidadeMapper;
import com.utfpr.donare.mapper.ParticipacaoMapper;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.NecessidadeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NecessidadeService{

    private final NecessidadeRepository necessidadeRepository;

    private final CampanhaRepository campanhaRepository;

    private final NecessidadeMapper necessidadeMapper;

    @Transactional
    public NecessidadeResponseDTO saveNecessidade(Long idCampanha, NecessidadeRequestDTO necessidadeRequestDTO) {

        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));

        Necessidade necessidade = new Necessidade();
        necessidade.setNome(necessidadeRequestDTO.getNome());
        necessidade.setUnidadeMedida(necessidadeRequestDTO.getUnidadeMedida());
        necessidade.setQuantidadeNecessaria(necessidadeRequestDTO.getQuantidadeNecessaria());
        necessidade.setQuantidadeRecebida(necessidadeRequestDTO.getQuantidadeRecebida());
        necessidade.setCampanha(campanha);

        Necessidade necessidadeSalva = necessidadeRepository.save(necessidade);
        return converterParaResponseDTO(necessidadeSalva);
    }


    public List<NecessidadeResponseDTO> listarNecessidadesPorCampanha(Long idCampanha) {
        if (!campanhaRepository.existsById(idCampanha)) {
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }
        List<Necessidade> necessidades = necessidadeRepository.findByCampanhaIdOrderByDataCriacaoDesc(idCampanha);
        return necessidades.stream().map(this::converterParaResponseDTO).collect(Collectors.toList());
    }


    public NecessidadeResponseDTO buscarNecessidadePorId(Long idCampanha, Long idNecessidade) {
        Necessidade necessidade = necessidadeRepository.findById(idNecessidade)
                .orElseThrow(() -> new ResourceNotFoundException("Necessidade não encontrada com o id: " + idNecessidade));

        if (!necessidade.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Necessidae com id " + idNecessidade + " não pertence à campanha com id " + idCampanha);
        }
        return converterParaResponseDTO(necessidade);
    }

    @Transactional
    public NecessidadeResponseDTO updateNecessidade(Long idNecessidade, NecessidadeRequestDTO necessidadeRequestDTO) {
        Necessidade necessidade = necessidadeRepository.findById(idNecessidade)
                .orElseThrow(() -> new ResourceNotFoundException("Necessidade não encontrada com o id: " + idNecessidade));
        necessidade.setNome(necessidadeRequestDTO.getNome());
        necessidade.setUnidadeMedida(necessidadeRequestDTO.getUnidadeMedida());
        necessidade.setQuantidadeNecessaria(necessidadeRequestDTO.getQuantidadeNecessaria());
        necessidade.setQuantidadeRecebida(necessidadeRequestDTO.getQuantidadeRecebida());

        Necessidade necessidadeAtualizada = necessidadeRepository.save(necessidade);
        return converterParaResponseDTO(necessidadeAtualizada);
    }

    @Transactional
    public void deleteNecessidade(Long idNecessidade) {
        Necessidade necessidade = necessidadeRepository.findById(idNecessidade)
                .orElseThrow(() -> new ResourceNotFoundException("Necessidade não encontrada com o id: " + idNecessidade));
        necessidadeRepository.delete(necessidade);
    }

    private NecessidadeResponseDTO converterParaResponseDTO(Necessidade necessidade) {
        Campanha campanha = necessidade.getCampanha();

        return new NecessidadeResponseDTO(
                necessidade.getId(),
                necessidade.getNome(),
                necessidade.getQuantidadeNecessaria(),
                necessidade.getQuantidadeRecebida(),
                necessidade.getDataCriacao(),
                necessidade.getUnidadeMedida(),
                campanha != null ? campanha.getId() : null,
                campanha != null ? campanha.getTitulo() : "Campanha não associada",
                campanha != null ? campanha.getCategoriaCampanha() : "N/A",
                campanha != null ? campanha.getEndereco().getEnderecoString() : "N/A",
                campanha != null ? campanha.getStatus() : "N/A",
                campanha != null ? campanha.getTipoCertificado() : "N/A",
                campanha != null ? campanha.getDtInicio() : null,
                campanha != null ? campanha.getDt_fim() : null
        );
    }
}
