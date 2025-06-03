package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.Postagem;
import com.utfpr.donare.dto.PostagemRequestDTO;
import com.utfpr.donare.dto.PostagemResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.BeanMapping;

@Mapper(componentModel = "spring")
public interface PostagemMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "organizadorEmail", ignore = true)
    @Mapping(target = "campanha", ignore = true)
    @Mapping(target = "midia", ignore = true)
    Postagem requestDtoToEntity(PostagemRequestDTO dto);

    @Mapping(target = "midia", ignore = true)
    PostagemResponseDTO entityToResponseDto(Postagem postagem);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataCriacao", ignore = true)
    @Mapping(target = "organizadorEmail", ignore = true)
    @Mapping(target = "campanha", ignore = true)
    @Mapping(target = "midia", ignore = true)
    void updateEntityFromRequestDto(PostagemRequestDTO dto, @MappingTarget Postagem postagem);

}

