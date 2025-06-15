package com.utfpr.donare.service;

import com.utfpr.donare.config.jwt.JwtTokenUtil;
import com.utfpr.donare.domain.Endereco;
import com.utfpr.donare.domain.TipoUsuario;
import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserRequestDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import com.utfpr.donare.exception.BadRequestException;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.exception.UnauthorizedException;
import com.utfpr.donare.mapper.EnderecoMapper;
import com.utfpr.donare.mapper.UserMapper;
import com.utfpr.donare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final EnderecoMapper enderecoMapper;

    @Transactional
    public  UserResponseDTO save(UserRequestDTO dto, MultipartFile midia) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {

            throw new BadRequestException("O e-mail '" + dto.getEmail() + "' já está em uso.");
        }

        if (userRepository.findByCpfOuCnpj(dto.getCpfOuCnpj()).isPresent()) {

            throw new BadRequestException("O CPF/CNPJ '" + dto.getCpfOuCnpj() + "' já está cadastrado.");
        }

        Endereco endereco = enderecoMapper.toEndereco(dto.getEndereco());

        User user = User.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .cpfOuCnpj(dto.getCpfOuCnpj())
                .password(passwordEncoder.encode(dto.getPassword()))
                .idEndereco(endereco)
                .ativo(true)
                .tipoUsuario(dto.getTipoUsuario() == 0 ? TipoUsuario.PESSOA_FISICA : TipoUsuario.PESSOA_JURIDICA)
                .build();

        endereco.setUser(user);

        setUserMidia(midia, user);

        userRepository.save(user);

        return userMapper.toUserResponseDTO(user);
    }

    private static void setUserMidia(MultipartFile midia, User user) {

        if (midia != null && !midia.isEmpty()) {

            try {

                byte[] midiaBytes = midia.getBytes();
                String contentType = midia.getContentType();

                user.setMidia(midiaBytes);
                user.setMidiaContentType(contentType);
            } catch (IOException e) {

                throw new RuntimeException("Erro ao processar arquivo de mídia do usuário", e);
            }
        }
    }

    @Transactional
    public void delete(Long id) {

        if (!userRepository.existsById(id)) {

            throw new ResourceNotFoundException("Usuário com ID " + id + " não encontrado para exclusão.");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponseDTO update(Long id, UserRequestDTO dto, MultipartFile midia) {

        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + id));

        verifyEmailInUseAndThowException(id, dto);
        verifyCpfCnpjInUseAndThrowException(id, dto, user);

        user.setNome(dto.getNome());
        user.setEmail(dto.getEmail());
        user.setCpfOuCnpj(dto.getCpfOuCnpj());
        user.setTipoUsuario(dto.getTipoUsuario() == 0 ? TipoUsuario.PESSOA_FISICA : TipoUsuario.PESSOA_JURIDICA);

        Endereco endereco = user.getIdEndereco();

        if (endereco == null) {
            endereco = enderecoMapper.toEndereco(dto.getEndereco());
            endereco.setUser(user);
            user.setIdEndereco(endereco);
        } else {
            enderecoMapper.updateEnderecoFromDto(dto.getEndereco(), endereco);
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        setUserMidia(midia, user);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toUserResponseDTO(updatedUser);
    }

    private void verifyCpfCnpjInUseAndThrowException(Long id, UserRequestDTO dto, User user) {
        if (userRepository.findByCpfOuCnpj(dto.getCpfOuCnpj()).isPresent() &&
                !userRepository.findByCpfOuCnpj(dto.getCpfOuCnpj()).get().getId().equals(id)) {
            throw new BadRequestException("O CPF/CNPJ '" + dto.getCpfOuCnpj() + "' já está cadastrado para outro usuário.");
        }
        user.setNome(dto.getNome());
    }

    private void verifyEmailInUseAndThowException(Long id, UserRequestDTO dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()
                && !userRepository.findByEmail(dto.getEmail()).get().getId().equals(id)) {
            throw new BadRequestException("O e-mail '" + dto.getEmail() + "' já está em uso por outro usuário.");
        }

    }

    public UserResponseDTO findById(Long id) {

        return userRepository.findById(id)
                .map(userMapper::toUserResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Id de usuário não encontrado. ID de busca: " + id));
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