package com.utfpr.donare.service;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Comentario;
import com.utfpr.donare.domain.EmailType;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import com.utfpr.donare.dto.EmailRequestDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.mapper.ComentarioMapper;
import com.utfpr.donare.mapper.UserMapper;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.ComentarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final CampanhaRepository campanhaRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final ComentarioMapper comentarioMapper;
    private final EmailService emailService;

    @Transactional
    public ComentarioResponseDTO saveComentario(Long idCampanha, ComentarioRequestDTO comentarioRequestDTO) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));

        User user = userService.findByEmail(comentarioRequestDTO.getUserEmail());

        Comentario comentario = new Comentario();
        comentario.setConteudo(comentarioRequestDTO.getConteudo());
        comentario.setCampanha(campanha);
        comentario.setUser(user);

        EmailType emailType = null;
        String emailUser = null;
        String nameUser = null;

        Map<String, String> variables = new HashMap<>();
        variables.put("name", user.getNome());
        variables.put("tituloCampanha", campanha.getTitulo());
        variables.put("comentario", comentario.getConteudo());

        // Trata o comentário pai, se houver
        if (comentarioRequestDTO.getIdComentarioPai() != null) {
            Comentario comentarioPai = comentarioRepository.findById(comentarioRequestDTO.getIdComentarioPai())
                    .orElseThrow(() -> new ResourceNotFoundException("Comentário pai não encontrado com o id: " + comentarioRequestDTO.getIdComentarioPai()));
            comentario.setComentarioPai(comentarioPai);

            emailUser = comentarioPai.getUser().getEmail();
            nameUser = comentarioPai.getUser().getNome();
            emailType = EmailType.NOVARESPOSTA;
        } else {
            emailUser = campanha.getOrganizador();
            nameUser = campanha.getOrganizador();
            emailType = EmailType.NOVOCOMENTARIO;
        }

        EmailRequestDTO request = new EmailRequestDTO(emailUser, nameUser, variables, emailType);
        emailService.sendEmail(request);

        Comentario comentarioSalvo = comentarioRepository.save(comentario);
        return converterParaResponseDTO(comentarioSalvo);
    }

    public List<ComentarioResponseDTO> listarComentariosPorCampanha(Long idCampanha) {
        
        if (!campanhaRepository.existsById(idCampanha)) {
        
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }
        
        List<Comentario> comentarios = comentarioRepository.findByCampanhaIdOrderByDataCriacaoDesc(idCampanha);
        
        return comentarios.stream().map(this::converterParaResponseDTO).collect(Collectors.toList());
    }

    private Comentario findComentarioById(Long idComentario) {

        return comentarioRepository.findById(idComentario).orElseThrow(() -> new ResourceNotFoundException("Comentario não encontado"));
    }


    public ComentarioResponseDTO buscarComentarioPorId(Long idCampanha, Long idComentario) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario não encontrado com o id: " + idComentario));

        if (!comentario.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Comentario com id " + idComentario + " não pertence à campanha com id " + idCampanha);
        }
        return converterParaResponseDTO(comentario);
    }

    @Transactional
    public ComentarioResponseDTO updateComentario(Long idComentario,ComentarioRequestDTO comentarioRequestDTO) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario não encontrada com o id: " + idComentario));

        User user = userService.findByEmail(comentarioRequestDTO.getUserEmail());

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

    @Transactional
    public void deleteComentario(Long idComentario, ComentarioRequestDTO comentarioRequestDTO) {
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
                userMapper.toUserResponseDTO(comentario.getUser()),
                idComentarioPai,
                comentario.getCampanha().getId());
    }
}
