package com.utfpr.donare.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "postagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Campanha campanha;

    @Column(nullable = false)
    private String organizadorEmail;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "midia")
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    private byte[] midia;

    @Column(name = "midiaContentType")
    private String midiaContentType;

    public Postagem(String titulo, String conteudo, Campanha campanha, String organizadorEmail) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.campanha = campanha;
        this.organizadorEmail = organizadorEmail;
    }
}
