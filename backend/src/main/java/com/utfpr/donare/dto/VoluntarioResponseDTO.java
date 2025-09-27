package com.utfpr.donare.dto;

import com.utfpr.donare.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoluntarioResponseDTO {
    private Long id;
    private String nome;
    private String email;

    public VoluntarioResponseDTO(User user) {
        this.id = user.getId();
        this.nome = user.getNome();
        this.email = user.getEmail();
    }
}
