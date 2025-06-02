package com.utfpr.donare.service;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;

import java.util.List;

public interface PostagemService {
    PostagemResponseDTO criarPostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, String organizadorEmail);

    List<PostagemResponseDTO> listarPostagensPorCampanha(Long idCampanha);

    PostagemResponseDTO buscarPostagemPorId(Long idPostagem, Long idCampanha);

    PostagemResponseDTO editarPostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, String organizadorEmail);

    void deletarPostagem(Long idPostagem, String organizadorEmail);

    byte[] obterMidiaPostagem(Long idPostagem);

    void adicionarMidiaPostagem(Long idPostagem, org.springframework.web.multipart.MultipartFile midia, String organizadorEmail);

}


