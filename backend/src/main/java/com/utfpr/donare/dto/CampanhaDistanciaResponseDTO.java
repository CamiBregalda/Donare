package com.utfpr.donare.dto;

import com.utfpr.donare.domain.Campanha;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampanhaDistanciaResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String categoriaCampanha;
    private String cidade;
    private String estado;
    private double distancia;

}
