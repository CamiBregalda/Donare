package com.utfpr.donare.service;

import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;

import java.util.List;

public interface ComentarioService {

    ComentarioResponseDTO criarComentario(Long idCampanha, ComentarioRequestDTO comentarioRequestDTO, String userEmail);

    List<ComentarioResponseDTO> listarComentariosPorCampanha(Long idCampanha);

    ComentarioResponseDTO buscarComentarioPorId(Long idCampanha, Long idComentario);

    ComentarioResponseDTO editarComentario(Long idComentario, ComentarioRequestDTO comentarioRequestDTO, String userEmail);

    void deletarComentario(Long idComentario, String userEmail);
}
