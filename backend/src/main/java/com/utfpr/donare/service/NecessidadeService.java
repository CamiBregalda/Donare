package com.utfpr.donare.service;

import com.utfpr.donare.dto.NecessidadeRequestDTO;
import com.utfpr.donare.dto.NecessidadeResponseDTO;


import java.util.List;

public interface NecessidadeService {
    NecessidadeResponseDTO criarNecessidade(Long idCampanha, NecessidadeRequestDTO necessidadeRequestDTO);

    List<NecessidadeResponseDTO> listarNecessidadesPorCampanha(Long idCampanha);

    NecessidadeResponseDTO buscarNecessidadePorId(Long idCampanha, Long idNecessidade);

    NecessidadeResponseDTO editarNecessidade(Long idNecessidade, NecessidadeRequestDTO necessidadeRequestDTO);

    void deletarNecessidade(Long idNecessidade);
}
