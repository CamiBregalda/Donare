package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.Participacao;
import com.utfpr.donare.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacaoResponseDTO {
    private Long id;
    private Long campanhaId;
    private String tituloCampanha;
    private Long userId;
    private String nomeUsuario;
    private LocalDateTime dataHoraParticipacao;

    public ParticipacaoResponseDTO(Participacao participacao){
        Campanha campanha = participacao.getCampanha();
        User usuario = participacao.getUser();

        this.id = participacao.getId();
        this.campanhaId = campanha.getId();
        this.tituloCampanha = campanha.getTitulo();
        this.userId = usuario.getId();
        this.nomeUsuario = usuario.getNome();
        this.dataHoraParticipacao = participacao.getDataHoraParticipacao();
    }
}
