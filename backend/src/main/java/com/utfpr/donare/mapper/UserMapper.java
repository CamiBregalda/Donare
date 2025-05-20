package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserRequestDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserRequestDTO userRequestDTO);

    User toUser(UserResponseDTO UserResponseDTO);

    UserRequestDTO toUserRequestDTO(User user);

    UserResponseDTO toUserResponseDTO(User user);

}
