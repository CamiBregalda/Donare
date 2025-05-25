package com.utfpr.donare.service;

import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import com.utfpr.donare.dto.VoluntarioResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.model.Campanha;
import com.utfpr.donare.repository.CampanhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampanhaServiceImpl implements CampanhaService {

    private final CampanhaRepository campanhaRepository;

    @Autowired
    public CampanhaServiceImpl(CampanhaRepository campanhaRepository) {
        this.campanhaRepository = campanhaRepository;
    }

    @Override
    @Transactional
    public CampanhaResponseDTO criarCampanha(CampanhaRequestDTO campanhaRequestDTO, String organizadorEmail) {
        Campanha campanha = new Campanha();
        campanha.setTitulo(campanhaRequestDTO.getTitulo());
        campanha.setDescricao(campanhaRequestDTO.getDescricao());
        campanha.setCategoriaCampanha(campanhaRequestDTO.getCategoriaCampanha());
        campanha.setEndereco(campanhaRequestDTO.getEndereco());
        campanha.setStatus(campanhaRequestDTO.getStatus());
        campanha.setTipoCertificado(campanhaRequestDTO.getTipoCertificado());
        campanha.setDt_inicio(java.time.LocalDateTime.now());
        campanha.setDt_fim(campanhaRequestDTO.getDt_fim());
        campanha.setOrganizador(organizadorEmail);

        if (campanhaRequestDTO.getImagemCapa() != null && !campanhaRequestDTO.getImagemCapa().isEmpty()) {
            try {
                byte[] imagemBytes = campanhaRequestDTO.getImagemCapa().getBytes();
                campanha.setImagemCapa(imagemBytes);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar imagem", e);
            }
        }
        Campanha campanhaSalva = campanhaRepository.save(campanha);
        return converterParaResponseDTO(campanhaSalva);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampanhaResponseDTO> listarCampanhas(String tipo, String localidade, int page, int size, String sort) {
        Pageable pageable;

        if (sort != null && !sort.isEmpty()) {
            Sort.Direction direction = Sort.Direction.DESC;
            String property = "dt_inicio";
            if (sort.equals("dt_fim")) {
                property = "dt_fim";
            }
            pageable = PageRequest.of(page, size, Sort.by(direction, property));
        } else {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dt_inicio"));
        }

        Page<Campanha> campanhasPage;

        if (tipo != null && !tipo.isEmpty() && localidade != null && !localidade.isEmpty()) {
            campanhasPage = campanhaRepository.findAll(pageable);
            List<Campanha> filtradas = campanhasPage.getContent().stream()
                    .filter(c -> tipo.equalsIgnoreCase(c.getCategoriaCampanha()))
                    .filter(c -> c.getEndereco() != null && c.getEndereco().toLowerCase().contains(localidade.toLowerCase()))
                    .collect(Collectors.toList());
            return filtradas.stream()
                    .map(this::converterParaResponseDTO)
                    .collect(Collectors.toList());
        } else if (tipo != null && !tipo.isEmpty()) {
            campanhasPage = campanhaRepository.findAll(pageable);
            return campanhasPage.getContent().stream()
                    .filter(c -> tipo.equalsIgnoreCase(c.getCategoriaCampanha()))
                    .map(this::converterParaResponseDTO)
                    .collect(Collectors.toList());
        } else if (localidade != null && !localidade.isEmpty()) {
            campanhasPage = campanhaRepository.findAll(pageable);
            return campanhasPage.getContent().stream()
                    .filter(c -> c.getEndereco() != null && c.getEndereco().toLowerCase().contains(localidade.toLowerCase()))
                    .map(this::converterParaResponseDTO)
                    .collect(Collectors.toList());
        } else {
            campanhasPage = campanhaRepository.findAll(pageable);
            return campanhasPage.getContent().stream()
                    .map(this::converterParaResponseDTO)
                    .collect(Collectors.toList());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CampanhaResponseDTO buscarCampanhaPorId(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return converterParaResponseDTO(campanha);
    }

    @Override
    @Transactional
    public CampanhaResponseDTO atualizarCampanha(Long id, CampanhaRequestDTO campanhaRequestDTO, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));

        if (!campanha.getOrganizador().equals(organizadorEmail)) {
            throw new RuntimeException("Apenas o organizador pode atualizar a campanha");
        }
        if (campanhaRequestDTO.getTitulo() != null) {
            campanha.setTitulo(campanhaRequestDTO.getTitulo());
        }
        if (campanhaRequestDTO.getDescricao() != null) {
            campanha.setDescricao(campanhaRequestDTO.getDescricao());
        }
        if (campanhaRequestDTO.getCategoriaCampanha() != null) {
            campanha.setCategoriaCampanha(campanhaRequestDTO.getCategoriaCampanha());
        }
        if (campanhaRequestDTO.getEndereco() != null) {
            campanha.setEndereco(campanhaRequestDTO.getEndereco());
        }
        if (campanhaRequestDTO.getStatus() != null) {
            campanha.setStatus(campanhaRequestDTO.getStatus());
        }
        if (campanhaRequestDTO.getTipoCertificado() != null) {
            campanha.setTipoCertificado(campanhaRequestDTO.getTipoCertificado());
        }
        if (campanhaRequestDTO.getDt_fim() != null) {
            campanha.setDt_fim(campanhaRequestDTO.getDt_fim());
        }
        if (campanhaRequestDTO.getImagemCapa() != null && !campanhaRequestDTO.getImagemCapa().isEmpty()) {
            try {
                byte[] imagemBytes = campanhaRequestDTO.getImagemCapa().getBytes();
                campanha.setImagemCapa(imagemBytes);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar imagem", e);
            }
        }
        Campanha campanhaSalva = campanhaRepository.save(campanha);
        return converterParaResponseDTO(campanhaSalva);
    }

    @Override
    @Transactional
    public void deletarCampanha(Long id, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        if (!campanha.getOrganizador().equals(organizadorEmail)) {
            throw new RuntimeException("Apenas o organizador pode deletar a campanha");
        }
        campanhaRepository.delete(campanha);
    }

    @Override
    @Transactional
    public void adicionarMidiaCampanha(Long id, MultipartFile midia, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));

        if (midia != null && !midia.isEmpty()) {
            try {
                campanha.setImagemCapa(midia.getBytes());
                campanhaRepository.save(campanha);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar e salvar mídia da campanha", e);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] obterMidiaCampanha(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return campanha.getImagemCapa();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoluntarioResponseDTO> listarVoluntariosPorCampanha(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        List<VoluntarioResponseDTO> voluntarios = new ArrayList<>();
        return voluntarios;
    }

    private CampanhaResponseDTO converterParaResponseDTO(Campanha campanha) {
        CampanhaResponseDTO dto = new CampanhaResponseDTO();
        dto.setId(campanha.getId());
        dto.setTitulo(campanha.getTitulo());
        dto.setDescricao(campanha.getDescricao());
        dto.setCategoriaCampanha(campanha.getCategoriaCampanha());
        dto.setEndereco(campanha.getEndereco());
        dto.setStatus(campanha.getStatus());
        dto.setTipoCertificado(campanha.getTipoCertificado());
        dto.setDt_inicio(campanha.getDt_inicio());
        dto.setDt_fim(campanha.getDt_fim());
        dto.setOrganizador(campanha.getOrganizador());

        if (campanha.getPostagens() != null && !campanha.getPostagens().isEmpty()) {
            List<PostagemResponseDTO> postagemDTOs = campanha.getPostagens().stream()
                    .map(postagem -> {
                        PostagemResponseDTO postagemDTO = new PostagemResponseDTO();
                        postagemDTO.setId(postagem.getId());
                        postagemDTO.setTitulo(postagem.getTitulo());
                        postagemDTO.setConteudo(postagem.getConteudo());
                        postagemDTO.setDataCriacao(postagem.getDataCriacao());
                        postagemDTO.setOrganizadorEmail(postagem.getOrganizadorEmail());
                        postagemDTO.setMidia(postagem.getMidia());
                        return postagemDTO;
                    })
                    .collect(Collectors.toList());
            dto.setPostagens(postagemDTOs);
        }
        dto.setImagemCapa(campanha.getImagemCapa());
        return dto;
    }
}

