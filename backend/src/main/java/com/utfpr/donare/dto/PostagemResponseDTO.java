package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Postagem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostagemResponseDTO {

    private Long id;
    private String titulo;
    private String conteudo;
    private LocalDateTime dataCriacao;
    private String organizadorEmail;
    private byte[] midia;

    private Long campanhaId;
    private String campanhaTitulo;
    private String campanhaCategoria;
    private String campanhaEndereco;
    private String campanhaStatus;
    private String campanhaTipoCertificado;
    private LocalDateTime campanhaDtInicio = LocalDateTime.now();
    private LocalDateTime campanhaDtFim;
    private String campanhaOrganizadorPrincipal;

    public PostagemResponseDTO(Postagem postagem) {
        this.id = postagem.getId();
        this.titulo = postagem.getTitulo();
        this.conteudo = postagem.getConteudo();
        this.dataCriacao = postagem.getDataCriacao();
        this.organizadorEmail = postagem.getOrganizadorEmail();
        this.midia = postagem.getMidia();

        if (postagem.getCampanha() != null) {
            this.campanhaId = postagem.getCampanha().getId();
            this.campanhaTitulo = postagem.getCampanha().getTitulo();
            this.campanhaCategoria = postagem.getCampanha().getCategoriaCampanha();
            this.campanhaEndereco = postagem.getCampanha().getEndereco().toString();
            this.campanhaStatus = postagem.getCampanha().getStatus();
            this.campanhaTipoCertificado = postagem.getCampanha().getTipoCertificado();
            this.campanhaDtInicio = postagem.getCampanha().getDtInicio();
            this.campanhaDtFim = postagem.getCampanha().getDt_fim();
            this.campanhaOrganizadorPrincipal = postagem.getCampanha().getOrganizador();
        }
    }
}
