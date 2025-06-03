package com.utfpr.donare.service;

import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import com.utfpr.donare.dto.VoluntarioResponseDTO;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.mapper.CampanhaMapper;
import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.repository.CampanhaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampanhaServiceImpl implements CampanhaService {

    private final CampanhaRepository campanhaRepository;
    private final CampanhaMapper campanhaMapper;

    @Override
    @Transactional
    public CampanhaResponseDTO criarCampanha(CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail) {
        Campanha campanha = campanhaMapper.requestDtoToEntity(campanhaRequestDTO);
        campanha.setOrganizador(organizadorEmail);
        campanha.setDt_inicio(java.time.LocalDateTime.now());

        if (imagemCapa != null && !imagemCapa.isEmpty()) {
            try {
                byte[] imagemBytes = imagemCapa.getBytes();
                String contentType = imagemCapa.getContentType();
                campanha.setImagemCapa(imagemBytes);
                campanha.setImagemCapaContentType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar imagem de capa", e);
            }
        }
        Campanha campanhaSalva = campanhaRepository.save(campanha);
        return campanhaMapper.entityToResponseDto(campanhaSalva);
    }

    private Specification<Campanha> criarFiltroCampanha(String tipo, String localidade) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tipo != null && !tipo.isEmpty()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("categoriaCampanha")), tipo.toLowerCase()));
            }
            if (localidade != null && !localidade.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("endereco")), "%" + localidade.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampanhaResponseDTO> listarCampanhas(String tipo, String localidade, int page, int size, String sort) {
        Sort.Direction direction = Sort.Direction.DESC;
        String property = "dt_inicio";
        if (sort != null && !sort.isEmpty()) {
            if (sort.equalsIgnoreCase("dt_fim")) {
                property = "dt_fim";
            } else if (sort.equalsIgnoreCase("titulo")) {
                property = "titulo";
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
        Specification<Campanha> spec = criarFiltroCampanha(tipo, localidade);
        Page<Campanha> campanhasPage = campanhaRepository.findAll(spec, pageable);

        return campanhasPage.getContent().stream()
                .map(campanhaMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CampanhaResponseDTO buscarCampanhaPorId(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return campanhaMapper.entityToResponseDto(campanha);
    }

    @Override
    @Transactional
    public CampanhaResponseDTO atualizarCampanha(Long id, CampanhaRequestDTO campanhaRequestDTO, MultipartFile imagemCapa, String organizadorEmail) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));

        if (!campanha.getOrganizador().equals(organizadorEmail)) {
            throw new RuntimeException("Apenas o organizador pode atualizar a campanha");
        }

        campanhaMapper.updateEntityFromRequestDto(campanhaRequestDTO, campanha);

        if (imagemCapa != null && !imagemCapa.isEmpty()) {
            try {
                byte[] imagemBytes = imagemCapa.getBytes();
                String contentType = imagemCapa.getContentType();
                campanha.setImagemCapa(imagemBytes);
                campanha.setImagemCapaContentType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar nova imagem de capa", e);
            }
        }

        Campanha campanhaSalva = campanhaRepository.save(campanha);
        return campanhaMapper.entityToResponseDto(campanhaSalva);
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
    @Transactional(readOnly = true)
    public byte[] obterImagemCapa(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return campanha.getImagemCapa();
    }

    @Override
    @Transactional(readOnly = true)
    public String obterImagemCapaContentType(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return campanha.getImagemCapaContentType();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoluntarioResponseDTO> listarVoluntariosPorCampanha(Long id) {
        Campanha campanha = campanhaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + id));
        return new ArrayList<>();
    }
}
