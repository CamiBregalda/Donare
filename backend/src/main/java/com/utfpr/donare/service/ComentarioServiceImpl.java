package com.utfpr.donare.service;

import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Comentario;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.ComentarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final CampanhaRepository campanhaRepository;

    @Override
    public ComentarioResponseDTO criarComentario(Long idCampanha, ComentarioRequestDTO comentarioRequestDTO, String userEmail) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));

        Comentario comentario = new Comentario();
        comentario.setConteudo(comentarioRequestDTO.getConteudo());
        comentario.setUserEmail(userEmail);
        comentario.setIdComentarioPai(comentarioRequestDTO.getIdComentarioPai());

        Comentario comentarioSalvo = comentarioRepository.save(comentario);
        return converterParaResponseDTO(comentarioSalvo);
    }

    @Override
    public List<ComentarioResponseDTO> listarComentariosPorCampanha(Long idCampanha) {
        if (!campanhaRepository.existsById(idCampanha)) {
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }
        List<Comentario> comentarios = comentarioRepository.findByCampanhaIdOrderByDataCriacaoDesc(idCampanha);
        return comentarios.stream().map(this::converterParaResponseDTO).collect(Collectors.toList());
    }

    @Override
    public ComentarioResponseDTO buscarComentarioPorId(Long idCampanha, Long idComentario) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario não encontrado com o id: " + idComentario));

        if (!comentario.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Comentario com id " + idComentario + " não pertence à campanha com id " + idCampanha);
        }
        return converterParaResponseDTO(comentario);
    }

    @Override
    public ComentarioResponseDTO editarComentario(Long idComentario,ComentarioRequestDTO comentarioRequestDTO, String userEmail) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario não encontrada com o id: " + idComentario));

        comentario.setConteudo(comentarioRequestDTO.getConteudo());
        comentario.setUserEmail(userEmail);

        Comentario comentarioAtualizado = comentarioRepository.save(comentario);
        return converterParaResponseDTO(comentarioAtualizado);
    }

    @Override
    public void deletarComentario(Long idComentario, String userEmail) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idComentario));
        comentarioRepository.delete(comentario);
    }

    private ComentarioResponseDTO converterParaResponseDTO(Comentario comentario) {
        Campanha campanha = comentario.getCampanha();
        String organizadorCampanha = (campanha != null && campanha.getOrganizador() != null)
                ? campanha.getOrganizador() : "Organizador não disponível";

        return new ComentarioResponseDTO(
                comentario.getId(),
                comentario.getConteudo(),
                comentario.getDataCriacao(),
                comentario.getUser().getId(),
                comentario.getUserEmail(),
                comentario.getUser().getNome(),
                comentario.getIdComentarioPai(),
                comentario.getCampanha().getId());
    }
}
