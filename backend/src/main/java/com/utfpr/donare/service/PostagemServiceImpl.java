package com.utfpr.donare.service;

import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.model.Campanha;
import com.utfpr.donare.model.Postagem;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.PostagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostagemServiceImpl implements PostagemService {

    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private CampanhaRepository campanhaRepository;

    @Override
    public PostagemResponseDTO criarPostagem(Long idCampanha, PostagemRequestDTO postagemRequestDTO, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha));

        Postagem postagem = new Postagem();
        postagem.setTitulo(postagemRequestDTO.getTitulo());
        postagem.setConteudo(postagemRequestDTO.getConteudo());
        postagem.setCampanha(campanha);
        postagem.setOrganizadorEmail(organizadorEmail);

        if (postagemRequestDTO.getMidiasUrls() != null) {
            postagem.setMidias(new ArrayList<>(postagemRequestDTO.getMidiasUrls()));
        } else {
            postagem.setMidias(new ArrayList<>());
        }

        Postagem postagemSalva = postagemRepository.save(postagem);
        return converterParaResponseDTO(postagemSalva);
    }

    @Override
    public List<PostagemResponseDTO> listarPostagensPorCampanha(Long idCampanha) {
        if (!campanhaRepository.existsById(idCampanha)) {
            throw new ResourceNotFoundException("Campanha não encontrada com o id: " + idCampanha);
        }
        List<Postagem> postagens = postagemRepository.findByCampanhaIdOrderByDataCriacaoDesc(idCampanha);
        return postagens.stream().map(this::converterParaResponseDTO).collect(Collectors.toList());
    }

    @Override
    public PostagemResponseDTO buscarPostagemPorId(Long idCampanha, Long idPostagem) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));

        if (!postagem.getCampanha().getId().equals(idCampanha)) {
            throw new ResourceNotFoundException("Postagem com id " + idPostagem + " não pertence à campanha com id " + idCampanha);
        }
        return converterParaResponseDTO(postagem);
    }

    @Override
    public PostagemResponseDTO editarPostagem(Long idPostagem, PostagemRequestDTO postagemRequestDTO, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        postagem.setTitulo(postagemRequestDTO.getTitulo());
        postagem.setConteudo(postagemRequestDTO.getConteudo());

        if (postagemRequestDTO.getMidiasUrls() != null) {
            postagem.setMidias(new ArrayList<>(postagemRequestDTO.getMidiasUrls()));
        } else {
            postagem.setMidias(new ArrayList<>());
        }
        Postagem postagemAtualizada = postagemRepository.save(postagem);
        return converterParaResponseDTO(postagemAtualizada);
    }

    @Override
    public void deletarPostagem(Long idPostagem, String organizadorEmail) {
        Postagem postagem = postagemRepository.findById(idPostagem)
                .orElseThrow(() -> new ResourceNotFoundException("Postagem não encontrada com o id: " + idPostagem));
        postagemRepository.delete(postagem);
    }

    private PostagemResponseDTO converterParaResponseDTO(Postagem postagem) {
        Campanha campanha = postagem.getCampanha();
        String organizadorCampanha = (campanha != null && campanha.getOrganizador() != null) ? campanha.getOrganizador() : "Organizador não disponível";
        return new PostagemResponseDTO(
                postagem.getId(),
                postagem.getTitulo(),
                postagem.getConteudo(),
                postagem.getDataCriacao(),
                postagem.getOrganizadorEmail(),
                postagem.getMidias(),
                campanha != null ? campanha.getId() : null,
                campanha != null ? campanha.getTitulo() : "Campanha não associada",
                campanha != null ? campanha.getCategoriaCampanha() : "N/A",
                campanha != null ? campanha.getEndereco() : "N/A",
                campanha != null ? campanha.getStatus() : "N/A",
                campanha != null ? campanha.getTipoCertificado() : "N/A",
                campanha != null ? campanha.getDt_inicio() : null,
                campanha != null ? campanha.getDt_fim() : null,
                organizadorCampanha
        );
    }
}

