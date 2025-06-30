package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Endereco;
import com.utfpr.donare.domain.User;
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
        this.id = campanha.getId() != null ? campanha.getId() : null;
        this.titulo = campanha.getTitulo() != null ? campanha.getTitulo() : "";
        this.descricao = campanha.getDescricao() != null ? campanha.getDescricao() : "";
        this.categoriaCampanha = campanha.getCategoriaCampanha() != null ? campanha.getCategoriaCampanha() : "";
        this.endereco = campanha.getEndereco() != null ? entityfromEnderecoResponseDto(campanha.getEndereco()) : null;
        this.imagemCapa = null;
        this.status = campanha.getStatus() != null ? campanha.getStatus() : "";
        this.tipoCertificado = campanha.getTipoCertificado() != null ? campanha.getTipoCertificado() : "";
        this.dtInicio = campanha.getDtInicio() != null ? campanha.getDtInicio() : null;
        this.dt_fim = campanha.getDt_fim() != null ? campanha.getDt_fim() : null;
        this.organizador = campanha.getOrganizador() != null ? campanha.getOrganizador() : "";
        this.postagens = campanha.getPostagens().stream()
                .map(PostagemResponseDTO::new)
                .toList();
        this.voluntarios = campanha.getVoluntarios().stream()
                .map(this::entityfromUserResponseDTO)
                .toList();
        this.usuariosQueSeguem = campanha.getUsuariosQueSeguem().stream()
                .map(this::entityfromUserResponseDTO)
                .toList();
    }

    private UserResponseDTO entityfromUserResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDTO(user.getId(), user.getNome(), user.getEmail(), user.getCpfOuCnpj(), user.getTipoUsuario().getCodigo(), user.isAtivo(), entityfromEnderecoResponseDto(user.getIdEndereco()), user.getMidia(), user.getMidiaContentType());
    }

    private EnderecoResponseDto entityfromEnderecoResponseDto(Endereco endereco) {
        if (endereco == null) {
            return null;
        }
        return new EnderecoResponseDto(endereco.getId(), endereco.getLogradouro(), endereco.getNumero(), endereco.getComplemento(), endereco.getBairro(), endereco.getCidade(), endereco.getEstado(), endereco.getCep());
    }
}
