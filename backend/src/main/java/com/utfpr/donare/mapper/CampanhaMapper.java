package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.dto.CampanhaRequestDTO;
import com.utfpr.donare.dto.CampanhaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.BeanMapping;

@Mapper(componentModel = "spring", uses = {PostagemMapper.class})
public interface CampanhaMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dtInicio", ignore = true)
    @Mapping(target = "organizador", ignore = true)
    @Mapping(target = "postagens", ignore = true)
    @Mapping(target = "voluntarios", ignore = true)
    @Mapping(target = "imagemCapa", ignore = true)
    Campanha requestDtoToEntity(CampanhaRequestDTO dto);

    @Mapping(target = "imagemCapa", ignore = true)
    @Mapping(target = "voluntarios", ignore = true)
    @Mapping(target = "usuariosQueSeguem", ignore = true)
    CampanhaResponseDTO entityToResponseDto(Campanha campanha);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dtInicio", ignore = true)
    @Mapping(target = "organizador", ignore = true)
    @Mapping(target = "postagens", ignore = true)
    @Mapping(target = "voluntarios", ignore = true)
    @Mapping(target = "imagemCapa", ignore = true)
    void updateEntityFromRequestDto(CampanhaRequestDTO dto, @MappingTarget Campanha campanha);

}

