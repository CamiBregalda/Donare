package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Campanha;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampanhaResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String categoriaCampanha;
    private EnderecoResponseDto endereco;
    private byte[] imagemCapa;
    private String status;
    private String tipoCertificado;
    private LocalDateTime dtInicio;
    private LocalDateTime dt_fim;
    private String organizador;
    private List<PostagemResponseDTO> postagens = new ArrayList<>();
    private List<UserResponseDTO> voluntarios = new ArrayList<>();
    private List<UserResponseDTO> usuariosQueSeguem = new ArrayList<>();

    public CampanhaResponseDTO(Campanha campanha) {
        this.id = campanha.getId();
        this.titulo = campanha.getTitulo();
        this.descricao = campanha.getDescricao();
        this.categoriaCampanha = campanha.getCategoriaCampanha();
        this.endereco = endereco;
        this.imagemCapa = null;
        this.status = campanha.getStatus();
        this.tipoCertificado = campanha.getTipoCertificado();
        this.dtInicio = campanha.getDtInicio();
        this.dt_fim = campanha.getDt_fim();
        this.organizador = campanha.getOrganizador();
        this.postagens = campanha.getPostagens().stream()
                .map(PostagemResponseDTO::new)
                .toList();
        this.voluntarios = campanha.getVoluntarios().stream()
                .map(UserResponseDTO::new)
                .toList();
        this.usuariosQueSeguem = campanha.getUsuariosQueSeguem().stream()
                .map(UserResponseDTO::new)
                .toList();
    }
}
