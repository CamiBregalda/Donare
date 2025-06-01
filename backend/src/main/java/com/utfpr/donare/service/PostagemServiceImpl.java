package com.utfpr.donare.service;

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
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostagemServiceImpl implements PostagemService {

    private final PostagemRepository postagemRepository;
    private final CampanhaRepository campanhaRepository;
    private final PostagemMapper postagemMapper;

    @Override
    @Transactional
    public PostagemResponseDTO criarPostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));
        Postagem postagem = postagemMapper.requestDtoToEntity(postagemRequestDTO);
        postagem.setCampanha(campanha);
        postagem.setOrganizadorEmail(organizadorEmail);
        postagem.setDataCriacao(java.time.LocalDateTime.now());

        if (postagemRequestDTO.getMidia() != null && !postagemRequestDTO.getMidia().isEmpty()) {
            try {
                byte[] midiaBytes = postagemRequestDTO.getMidia().getBytes();
                postagem.setMidia(midiaBytes);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar arquivo de mídia da postagem", e);
            }
        }
        Postagem postagemSalva = postagemRepository.save(postagem);
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
    public PostagemResponseDTO buscarPostagemPorId(Long idCampanha, Long idPostagem) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));

        if (!postagem.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Postagem com id " + idPostagem + " não pertence à campanha com id " + idCampanha);
        }

        return postagemMapper.entityToResponseDto(postagem);
    }


    @Override
    @Transactional
    public PostagemResponseDTO editarPostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        postagemMapper.updateEntityFromRequestDto(postagemRequestDTO, postagem);

        if (postagemRequestDTO.getMidia() != null && !postagemRequestDTO.getMidia().isEmpty()) {
            try {
                byte[] midiaBytes = postagemRequestDTO.getMidia().getBytes();
                postagem.setMidia(midiaBytes);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar novo arquivo de mídia da postagem", e);
            }
        } else {
            postagem.setMidia(null);
        }

        Postagem postagemAtualizada = postagemRepository.save(postagem);
        return postagemMapper.entityToResponseDto(postagemAtualizada);
    }

    @Override
    @Transactional
    public void deletarPostagem(Long idPostagem, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
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
    @Transactional
    public void adicionarMidiaPostagem(Long idPostagem, MultipartFile midia, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        if (midia != null && !midia.isEmpty()) {
            try {
                byte[] midiaBytes = midia.getBytes();
                postagem.setMidia(midiaBytes);
                postagemRepository.save(postagem);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar e salvar mídia da postagem", e);
            }
        }
    }

}

