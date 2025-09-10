package com.utfpr.donare.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "endereco")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(onlyExplicitlyIncluded = true)
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String logradouro;

    private String complemento;

    private String bairro;

    private String numero;

    private String cidade;

    private String estado;

    private String cep;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id", unique = true)
    private Campanha campanha;

    public String getEnderecoString() {
        return logradouro + " número " + numero + ", " + complemento + ", " + bairro + ", " + cidade + ", " + estado + ", " + cep;
    }
}
