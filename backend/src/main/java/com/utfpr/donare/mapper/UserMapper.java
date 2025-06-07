package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.TipoUsuario;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserRequestDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    default TipoUsuario map(Integer value) {

        if (value == null) {
            return null;
        }

        for (TipoUsuario type : TipoUsuario.values()) {
            if (type.getCodigo() == value) {
                return type;
            }
        }

        throw new IllegalArgumentException("TipoUsuario não existe: " + value);
    }

    default Integer map(TipoUsuario tipoUsuario) {

        if (tipoUsuario == null) {
            return null;
        }

        return tipoUsuario.getCodigo();
    }

    User toUser(UserRequestDTO userRequestDTO);

    User toUser(UserResponseDTO UserResponseDTO);

    UserRequestDTO toUserRequestDTO(User user);

    UserResponseDTO toUserResponseDTO(User user);
}