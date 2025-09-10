package com.utfpr.donare.service;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostagemService {
    PostagemResponseDTO criarPostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail);

    List<PostagemResponseDTO> listarPostagensPorCampanha(Long idCampanha);

    PostagemResponseDTO buscarPostagemPorId(Long idPostagem);

    PostagemResponseDTO editarPostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail);

    void deletarPostagem(Long idPostagem, String organizadorEmail);

    byte[] obterMidiaPostagem(Long idPostagem);

    String obterMidiaContentType(Long idPostagem);
}
