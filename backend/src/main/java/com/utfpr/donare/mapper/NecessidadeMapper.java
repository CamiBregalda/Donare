package com.utfpr.donare.mapper;


import com.utfpr.donare.domain.Necessidade;
import com.utfpr.donare.dto.NecessidadeRequestDTO;
import com.utfpr.donare.dto.NecessidadeResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NecessidadeMapper {
    Necessidade toNecessidade(NecessidadeRequestDTO necessidadeRequestDTO);

    Necessidade toNecessidade(NecessidadeResponseDTO necessidadeResponseDTO);

    NecessidadeRequestDTO toNecessidadeRequestDTO(Necessidade necessidade);

    NecessidadeResponseDTO toNecessidadeResponseDTO(Necessidade necessidade);

}
