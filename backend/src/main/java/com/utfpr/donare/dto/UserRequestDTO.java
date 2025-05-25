package com.utfpr.donare.dto;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String nome;
    private String email;
    private String cpfOuCnpj;
    private String fotoPerfil;
    private String password;
}
