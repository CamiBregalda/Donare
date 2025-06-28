package com.utfpr.donare.domain;

import com.utfpr.donare.domain.enums.CategoriaEnum;
import com.utfpr.donare.domain.enums.TipoCertificadoEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @OneToOne(mappedBy = "campanha", cascade = CascadeType.ALL, orphanRemoval = true)
    private Endereco endereco;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "imagemCapa")
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    private byte[] imagemCapa;

    @Column(name = "imagemCapaContentType")
    private String imagemCapaContentType;

    private String status;

    private String tipoCertificado;

    private LocalDateTime dtInicio = LocalDateTime.now();

    private LocalDateTime dt_fim;

    @Column(nullable = false)
    private String organizador;

    //TODO VALIDAR SE ISSO SERÁ USADO
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

    @ManyToMany(mappedBy = "campanhasSeguidas", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<User> usuariosQueSeguem = new HashSet<>();

    private boolean ativo = true;
}