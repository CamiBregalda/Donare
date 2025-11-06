package com.utfpr.donare.service.interfaces;

import com.utfpr.donare.dto.CampanhaDistanciaResponseDTO;
import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CampanhaService {
    CampanhaResponseDTO saveCampanha(CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail);

    List<CampanhaResponseDTO> ListCampaignHistory(String tipo, String localidade, String usuario, String titulo, int page, int size, String sort);

    List<CampanhaResponseDTO> findCampanhas(String tipo, String localidade, String usuario, String titulo, int page, int size, String sort);

    CampanhaResponseDTO findCampanhaPorId(Long id);

    CampanhaResponseDTO updateCampanha(Long id, CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail);

    void deleteCampanha(Long id, String organizadorEmail);

    byte[] getCoverImage(Long id);

    String getCoverImageContentType(Long id);

    List<UserResponseDTO> listVolunteersByCampaign(Long id);

    List<CampanhaDistanciaResponseDTO> buscarCampanhasProximas(double latUser, double lonUser);
}
