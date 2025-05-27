package com.utfpr.donare.service;

import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Comentario;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.ComentarioRepository;
import com.utfpr.donare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final CampanhaRepository campanhaRepository;
    private final UserRepository userRepository;

    @Override
    public ComentarioResponseDTO criarComentario(Long idCampanha, ComentarioRequestDTO comentarioRequestDTO) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));

        User user = userRepository.findByEmail(comentarioRequestDTO.getUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrada com o email: " + comentarioRequestDTO.getUserEmail()));


        Comentario comentario = new Comentario();
        comentario.setConteudo(comentarioRequestDTO.getConteudo());
        comentario.setCampanha(campanha);
        comentario.setUser(user);

        // Trata o comentário pai, se houver
        if (comentarioRequestDTO.getIdComentarioPai() != null) {
            Comentario comentarioPai = comentarioRepository.findById(comentarioRequestDTO.getIdComentarioPai())
                    .orElseThrow(() -> new ResourceNotFoundException("Comentário pai não encontrado com o id: " + comentarioRequestDTO.getIdComentarioPai()));
            comentario.setComentarioPai(comentarioPai);
        }

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
    public ComentarioResponseDTO editarComentario(Long idComentario,ComentarioRequestDTO comentarioRequestDTO) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario não encontrada com o id: " + idComentario));

        User user = userRepository.findByEmail(comentarioRequestDTO.getUserEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrada com o email: " + comentarioRequestDTO.getUserEmail()));

        if(comentario.getUser().getEmail().equals(comentarioRequestDTO.getUserEmail())){
            comentario.setConteudo(comentarioRequestDTO.getConteudo());
            comentario.setUser(user);
        }
        else{
            throw new ResourceNotFoundException("Usuário com e-mail inválido para editar esse comentário" + comentarioRequestDTO.getUserEmail());
        }

        Comentario comentarioAtualizado = comentarioRepository.save(comentario);
        return converterParaResponseDTO(comentarioAtualizado);
    }

    @Override
    public void deletarComentario(Long idComentario, ComentarioRequestDTO comentarioRequestDTO) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado com o id: " + idComentario));

        if(comentario.getUser().getEmail().equals(comentarioRequestDTO.getUserEmail())){
            comentarioRepository.delete(comentario);
        }
        else{
            throw new ResourceNotFoundException("Usuário com e-mail inválido para excluir esse comentário" + comentarioRequestDTO.getUserEmail());
        }


    }

    private ComentarioResponseDTO converterParaResponseDTO(Comentario comentario) {
        Campanha campanha = comentario.getCampanha();
        String organizadorCampanha = (campanha != null && campanha.getOrganizador() != null)
                ? campanha.getOrganizador() : "Organizador não disponível";

        Long idComentarioPai = comentario.getComentarioPai() != null
                ? comentario.getComentarioPai().getId()
                : null;

        assert comentario.getCampanha() != null;
        return new ComentarioResponseDTO(
                comentario.getId(),
                comentario.getConteudo(),
                comentario.getDataCriacao(),
                comentario.getUser().getId(),
                comentario.getUser().getEmail(),
                comentario.getUser().getNome(),
                idComentarioPai ,
                comentario.getCampanha().getId());
    }
}
