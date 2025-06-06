package com.utfpr.donare.domain;

import com.utfpr.donare.domain.Campanha;
import com.utfpr.donare.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "participacao",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "campanha_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataHoraParticipacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campanha_id", nullable = false)
    private Campanha campanha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
