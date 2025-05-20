package com.utfpr.donare.service;

import com.utfpr.donare.config.jwt.JwtTokenUtil;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserDTO;
import com.utfpr.donare.mapper.UserMapper;
import com.utfpr.donare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @Transactional
    public UserDTO save(UserDTO dto) {

        User user = User.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .cpfOuCnpj(dto.getCpfOuCnpj())
                .fotoPerfil(dto.getFotoPerfil())
                .password(passwordEncoder.encode(dto.getPassword()))
                .ativo(true)
                .build();

        userRepository.save(user);

        return userMapper.toUserDTO(user);
    }

    @Transactional
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User update(Long id, UserDTO dto) {

        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setCpfOuCnpj(dto.getCpfOuCnpj());
        user.setFotoPerfil(dto.getFotoPerfil());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(user);
    }

    public String autenticar(String email, String senha) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(senha, user.getPassword())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        return jwtTokenUtil.autenticar(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public String compartilharCampanha(Long idCampanha) {

        return "https://donare.com/campanha/" + idCampanha;
    }

    public void voluntariarSe(Long idCampanha) {

        System.out.println("Usuário voluntariado na campanha ID: " + idCampanha);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + email));
    }
}
