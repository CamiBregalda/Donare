package com.utfpr.donare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoluntarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
}
