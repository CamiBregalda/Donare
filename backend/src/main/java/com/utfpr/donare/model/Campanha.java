package com.utfpr.donare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campanha")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campanha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descricao;

    private String categoriaCampanha;

    private String endereco;

    private String status;

    private String tipoCertificado;

    private LocalDateTime dt_inicio;

    private LocalDateTime dt_fim;

    @Column(nullable = false)
    private String organizador;

    @OneToMany(mappedBy = "campanha", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Postagem> postagens = new ArrayList<>();

    public void addPostagem(Postagem postagem) {
        this.postagens.add(postagem);
        postagem.setCampanha(this);
    }

    public void removePostagem(Postagem postagem) {
        this.postagens.remove(postagem);
        postagem.setCampanha(null);
    }
}
