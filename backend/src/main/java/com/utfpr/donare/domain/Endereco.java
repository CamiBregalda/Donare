package com.utfpr.donare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "endereco")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    private Double latitude;
    private Double longitude;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id", unique = true)
    private Campanha campanha;

    public String getEnderecoString() {
        return logradouro + " número " + numero + ", " + complemento + ", " + bairro + ", " + cidade + ", " + estado + ", " + cep;
    }

    public void updateUser(User user) {
        this.user = user;
    }
}
