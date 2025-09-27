package com.utfpr.donare.service.interfaces;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostagemService {
    PostagemResponseDTO savePostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail);

    List<PostagemResponseDTO> listPostsByCampaign(Long idCampanha);

    PostagemResponseDTO findPostById(Long idPostagem);

    PostagemResponseDTO updatePostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail);

    void deletePostagem(Long idPostagem, String organizadorEmail);

    byte[] getMediaPost(Long idPostagem);

    String getMediaContentType(Long idPostagem);
}
