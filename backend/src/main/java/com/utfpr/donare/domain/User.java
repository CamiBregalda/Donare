package com.utfpr.donare.domain;

import com.utfpr.donare.dto.UserRequestDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(onlyExplicitlyIncluded = true)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    private Endereco idEndereco;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String cpfOuCnpj;

    private String fotoPerfil;

    private String password;

    private String googleId;

    @Enumerated(EnumType.ORDINAL)
    private TipoUsuario tipoUsuario;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "midia")
    @JdbcTypeCode(SqlTypes.LONGVARBINARY)
    private byte[] midia;

    @Column(name = "midiaContentType")
    private String midiaContentType;

    private boolean ativo;

    @ManyToMany(mappedBy = "voluntarios", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Campanha> campanhasVoluntariadas = new HashSet<>();


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_campanha_seguida",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "campanha_id")
    )

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Campanha> campanhasSeguidas = new HashSet<>();

    public User(UserRequestDTO userRequestDTO, String password, Endereco endereco, TipoUsuario tipoUsuario) {
        this.nome = userRequestDTO.getNome();
        this.email = userRequestDTO.getEmail();
        this.cpfOuCnpj = userRequestDTO.getCpfOuCnpj();
        this.password = password;
        this.idEndereco = endereco;
        this.tipoUsuario = tipoUsuario;
        this.ativo = true;
        this.googleId = userRequestDTO.getGoogleId();
    }

    public void updateUserMidia(MultipartFile midia){
        if (midia != null && !midia.isEmpty()) {
            try {
                byte[] midiaBytes = midia.getBytes();
                String contentType = midia.getContentType();

                this.setMidia(midiaBytes);
                this.setMidiaContentType(contentType);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar arquivo de mídia do usuário", e);
            }
        }
    }

    public void update(UserRequestDTO dto) {
        this.nome = dto.getNome();
        this.email = dto.getEmail();
        this.cpfOuCnpj = dto.getCpfOuCnpj();
        if (dto.getTipoUsuario() != null) {
            this.tipoUsuario = dto.getTipoUsuario() == 1 ? TipoUsuario.PESSOA_FISICA : TipoUsuario.PESSOA_JURIDICA;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return ativo;
    }

    @Override
    public boolean isAccountNonLocked() {
        return ativo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return ativo;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }
}