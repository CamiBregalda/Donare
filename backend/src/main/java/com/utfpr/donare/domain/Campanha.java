package com.utfpr.donare.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "imagemCapa")
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    private byte[] imagemCapa;

    @Column(name = "imagemCapaContentType")
    private String imagemCapaContentType;

    private String status;

    private String tipoCertificado;

    private LocalDateTime dt_inicio = LocalDateTime.now();

    private LocalDateTime dt_fim;

    @Column(nullable = false)
    private String organizador;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "campanha_voluntarios",
            joinColumns = @JoinColumn(name = "campanha_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<User> voluntarios = new ArrayList<>();

    @OneToMany(mappedBy = "campanha", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Postagem> postagens = new ArrayList<>();

}
