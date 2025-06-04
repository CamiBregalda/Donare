package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.Endereco;
import com.utfpr.donare.dto.EnderecoRequestDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnderecoMapper {

    Endereco toEndereco(EnderecoRequestDto enderecoRequestDto);
}
