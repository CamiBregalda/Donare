package com.utfpr.donare.service;

import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.VoluntarioResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CampanhaService {
    CampanhaResponseDTO criarCampanha(CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail);

    List<CampanhaResponseDTO> listarCampanhas(String tipo, String localidade, String usuario, int page, int size, String sort);
    CampanhaResponseDTO buscarCampanhaPorId(Long id);

    CampanhaResponseDTO atualizarCampanha(Long id, CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail);

    void deletarCampanha(Long id, String organizadorEmail);

    byte[] obterImagemCapa(Long id);

    String obterImagemCapaContentType(Long id);

    List<VoluntarioResponseDTO> listarVoluntariosPorCampanha(Long id);
}
