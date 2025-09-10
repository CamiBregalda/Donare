package com.utfpr.donare.service;

import com.utfpr.donare.domain.EmailType;
import com.utfpr.donare.dto.EmailRequestDTO;
import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.mapper.PostagemMapper;
import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Postagem;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.PostagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostagemServiceImpl implements PostagemService {

    private final PostagemRepository postagemRepository;
    private final CampanhaRepository campanhaRepository;
    private final PostagemMapper postagemMapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public PostagemResponseDTO criarPostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));
        Postagem postagem = postagemMapper.requestDtoToEntity(postagemRequestDTO);
        postagem.setCampanha(campanha);
        postagem.setOrganizadorEmail(organizadorEmail);

        if (midia != null && !midia.isEmpty()) {
            try {
                byte[] midiaBytes = midia.getBytes();
                String contentType = midia.getContentType();
                postagem.setMidia(midiaBytes);
                postagem.setMidiaContentType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar arquivo de mídia da postagem", e);
            }
        }
        Postagem postagemSalva = postagemRepository.save(postagem);

        campanha.getUsuariosQueSeguem().forEach(usuario -> {
            Map<String, String> variables = new HashMap<>();
            variables.put("tituloCampanha", campanha.getTitulo());
            variables.put("tituloPostagem", postagem.getTitulo());
            variables.put("name", usuario.getNome());

            EmailRequestDTO request = new EmailRequestDTO(
                    usuario.getEmail(),
                    usuario.getNome(),
                    variables,
                    EmailType.NOVAPOSTAGEM
            );

            emailService.sendEmail(request);
        });

        return postagemMapper.entityToResponseDto(postagemSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostagemResponseDTO> listarPostagensPorCampanha(Long idCampanha) {
        if (!campanhaRepository.existsById(idCampanha)) {
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }
        List<Postagem> postagens = postagemRepository.findByCampanhaIdOrderByDataCriacaoDesc(idCampanha);
        return postagens.stream()
                .map(postagemMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostagemResponseDTO buscarPostagemPorId(Long idPostagem) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        return postagemMapper.entityToResponseDto(postagem);
    }

    @Override
    @Transactional
    public PostagemResponseDTO editarPostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, MultipartFile midia, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));

        if (!postagem.getOrganizadorEmail().equals(organizadorEmail)) {
            throw new RuntimeException("Apenas o organizador pode editar a postagem");
        }

        postagemMapper.updateEntityFromRequestDto(postagemRequestDTO, postagem);

        if (midia != null && !midia.isEmpty()) {
            try {
                byte[] midiaBytes = midia.getBytes();
                String contentType = midia.getContentType();
                postagem.setMidia(midiaBytes);
                postagem.setMidiaContentType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar novo arquivo de mídia da postagem", e);
            }
        }

        Postagem postagemAtualizada = postagemRepository.save(postagem);
        return postagemMapper.entityToResponseDto(postagemAtualizada);
    }

    @Override
    @Transactional
    public void deletarPostagem(Long idPostagem, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        if (!postagem.getOrganizadorEmail().equals(organizadorEmail)) {
            throw new RuntimeException("Apenas o organizador pode deletar a postagem");
        }
        postagemRepository.delete(postagem);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] obterMidiaPostagem(Long idPostagem) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        return postagem.getMidia();
    }

    @Override
    @Transactional(readOnly = true)
    public String obterMidiaContentType(Long idPostagem) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        return postagem.getMidiaContentType();
    }
}
