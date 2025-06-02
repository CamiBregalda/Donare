package com.utfpr.donare.service;

import com.utfpr.donare.config.jwt.JwtTokenUtil;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserRequestDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import com.utfpr.donare.exception.BadRequestException;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.exception.UnauthorizedException;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    @Transactional
    public UserResponseDTO save(UserRequestDTO dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {

            throw new BadRequestException("O e-mail '" + dto.getEmail() + "' já está em uso.");
        }

        if (userRepository.findByCpfOuCnpj(dto.getCpfOuCnpj()).isPresent()) {

            throw new BadRequestException("O CPF/CNPJ '" + dto.getCpfOuCnpj() + "' já está cadastrado.");
        }

        // todo verficar para usar mapper com o encoder!
        User user = User.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .cpfOuCnpj(dto.getCpfOuCnpj())
                .fotoPerfil(dto.getFotoPerfil())
                .password(passwordEncoder.encode(dto.getPassword()))
                .ativo(true)
                .build();

        userRepository.save(user);

        return userMapper.toUserResponseDTO(user);
    }

    @Transactional
    public void delete(Long id) {

        if (!userRepository.existsById(id)) {

            throw new ResourceNotFoundException("Usuário com ID " + id + " não encontrado para exclusão.");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public void update(Long id, UserRequestDTO dto) {

        User user = userRepository.findById(id).orElseThrow(() -> new BadRequestException("Usuário não encontrado"));
        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setCpfOuCnpj(dto.getCpfOuCnpj());
        user.setFotoPerfil(dto.getFotoPerfil());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepository.save(user);
    }

    public String autenticar(String email, String senha) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(senha, user.getPassword())) {

            throw new UnauthorizedException("Credenciais inválidas. E-mail ou senha incorretos.");
        }

        return jwtTokenUtil.autenticar(user);
    }

    public User findByEmail(String email) {

        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));
    }

    public List<UserResponseDTO> findAllUsersDTO() {

        return userRepository.findAll().stream()
                .map(userMapper::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    public String compartilharCampanha(Long idCampanha) {

        return "https://donare.com/campanha/" + idCampanha;
    }

    public void voluntariarSe(Long idCampanha) {

        System.out.println("Usuário voluntariado na campanha ID: " + idCampanha);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
    }
}