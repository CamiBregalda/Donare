package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.Participacao;
import com.utfpr.donare.dto.ParticipacaoRequestDTO;
import com.utfpr.donare.dto.ParticipacaoResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ParticipacaoMapper {
    Participacao toParticipacao(ParticipacaoRequestDTO participacaoRequestDTO);

    Participacao toParticipacao(ParticipacaoResponseDTO participacaoResponseDTO);

    ParticipacaoRequestDTO toParticipacaoRequestDTO(Participacao participacao);

    ParticipacaoResponseDTO toParticipacaoResponseDTO(Participacao participacao);
}
