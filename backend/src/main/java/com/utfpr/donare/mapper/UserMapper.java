package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toUser(UserDTO userDTO);

    UserDTO toUserDTO(User user);

}
