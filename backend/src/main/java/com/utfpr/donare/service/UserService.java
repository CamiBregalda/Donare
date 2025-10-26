package com.utfpr.donare.service;

import com.utfpr.donare.config.jwt.JwtTokenUtil;
import com.utfpr.donare.domain.*;
import com.utfpr.donare.dto.*;
import com.utfpr.donare.exception.BadRequestException;
import com.utfpr.donare.exception.ResourceNotFoundException;
import com.utfpr.donare.exception.UnauthorizedException;
import com.utfpr.donare.mapper.CampanhaMapper;
import com.utfpr.donare.mapper.EnderecoMapper;
import com.utfpr.donare.mapper.UserMapper;
import com.utfpr.donare.repository.CampanhaRepository;
import com.utfpr.donare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final EnderecoMapper enderecoMapper;
    private final CampanhaRepository campanhaRepository;
    private final CampanhaMapper campanhaMapper;
    private final EmailService emailService;

    @Transactional
    public  UserResponseDTO saveUsuario(UserRequestDTO dto, MultipartFile midia) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("O e-mail '" + dto.getEmail() + "' já está em uso.");
        }

        if (userRepository.findByCpfOuCnpj(dto.getCpfOuCnpj()).isPresent()) {
            throw new BadRequestException("O CPF/CNPJ '" + dto.getCpfOuCnpj() + "' já está cadastrado.");
        }

        if (dto.getGoogleId() == null || dto.getGoogleId().isEmpty()){
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                throw new BadRequestException("A senha é obrigatória quando não houver googleId.");
            }
        }

        Endereco endereco = enderecoMapper.toEndereco(dto.getEndereco());
        User user = new User(dto, passwordEncoder.encode(dto.getPassword()), endereco, TipoUsuario.valueOfCodigo(dto.getTipoUsuario()));

        endereco.updateUser(user);
        user.updateUserMidia(midia);

        userRepository.save(user);

        Map<String, String> variables = new HashMap<>();
        variables.put("name", user.getNome());
        EmailRequestDTO request = new EmailRequestDTO(user.getEmail(), user.getNome(), variables, EmailType.CADASTROCONTA);
        emailService.sendEmail(request);

        return userMapper.toUserResponseDTO(user);
    }

    @Transactional
    public void deleteUsuario(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário com ID " + id + " não encontrado para exclusão.");
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public UserResponseDTO updateUsuario(Long id, UserRequestDTO dto, MultipartFile midia) {
        User user = findUserById(id);

        verifyEmailInUseAndThowException(id, dto);
        verifyCpfCnpjInUseAndThrowException(id, dto, user);

        user.update(dto);

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

        user.updateUserMidia(midia);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toUserResponseDTO(updatedUser);
    }

    @Transactional
    public UserResponseDTO updatePassword(Long id, UserPasswordRequestDTO dto) {
        User user = findUserById(id);

        if (dto.getOldPassword() != null && !dto.getOldPassword().isBlank() && dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {

            if (passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
                user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            }
            else {
                throw new ResourceNotFoundException("senha antiga informada não encontrada");
            }
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

    private void verifyCpfFormatAndThrowException(Long id, UserRequestDTO dto, User user){

            String cpf = dto.getCpfOuCnpj().replace(".", "").replace("-", "");

            if (cpf == null) {
                throw new BadRequestException("CPF não pode ser nulo.");
            }

            if (cpf.length() != 11) {
                throw new BadRequestException("O CPF " + dto.getCpfOuCnpj() + "está incorreto.");
            }

            int[] multiplicadores1 = {10, 9, 8, 7, 6, 5, 4, 3, 2};
            int[] multiplicadores2 = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};

            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += Integer.parseInt(cpf.substring(i, i + 1)) * multiplicadores1[i];
            }
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += Integer.parseInt(cpf.substring(i, i + 1)) * multiplicadores2[i];
            }
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            if(digito1 == Integer.parseInt(cpf.substring(9, 10)) && digito2 == Integer.parseInt(cpf.substring(10))){
                user.setCpfOuCnpj(dto.getCpfOuCnpj());
            }
            else {
                throw new BadRequestException("O CPF " + dto.getCpfOuCnpj() + "está no formato inválido.");
            }
    }

    private void verifyCnpjFormatAndThrowException(Long id, UserRequestDTO dto, User user) {
        String cnpj = dto.getCpfOuCnpj();

        if (cnpj == null) {
            throw new BadRequestException("CNPJ não pode ser nulo.");
        }

        cnpj = cnpj.replaceAll("[^0-9]", "");

        if (cnpj.length() != 14 || cnpj.chars().distinct().count() == 1) {
            throw new BadRequestException("O CNPJ " + dto.getCpfOuCnpj() + " está incorreto.");
        }

        int[] multiplicadores1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] multiplicadores2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};


        int soma = 0;
        for (int i = 0; i < 12; i++) {
            soma += Character.getNumericValue(cnpj.charAt(i)) * multiplicadores1[i];
        }
        int resto = soma % 11;
        int digito1 = resto < 2 ? 0 : 11 - resto;


        soma = 0;
        for (int i = 0; i < 13; i++) {
            soma += Character.getNumericValue(cnpj.charAt(i)) * multiplicadores2[i];
        }
        resto = soma % 11;
        int digito2 = resto < 2 ? 0 : 11 - resto;

        if (digito1 == Character.getNumericValue(cnpj.charAt(12)) &&
                digito2 == Character.getNumericValue(cnpj.charAt(13))) {
            user.setCpfOuCnpj(dto.getCpfOuCnpj());
        } else {
            throw new BadRequestException("O CNPJ " + dto.getCpfOuCnpj() + " está incorreto.");
        }
    }


    private void verifyEmailInUseAndThowException(Long id, UserRequestDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()
                && !userRepository.findByEmail(dto.getEmail()).get().getId().equals(id)) {
            throw new BadRequestException("O e-mail '" + dto.getEmail() + "' já está em uso por outro usuário.");
        }

    }

    private void verifyEmailFormatAndThrowException(Long id, UserRequestDTO dto, User user) {
        String email = dto.getEmail();

        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("E-mail não pode ser nulo ou vazio.");
        }

        if (!email.contains("@") || !email.contains(".")) {
            throw new BadRequestException("O e-mail " + email + " está no formato inválido.");
        }

        user.setEmail(email);
    }

    public UserResponseDTO findUsuarioById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toUserResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Id de usuário não encontrado. ID de busca: " + id));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + id));
    }

    public String autenticar(String email, String senha) {

        User user = findByEmail(email);

        if (!passwordEncoder.matches(senha, user.getPassword())) {

            throw new UnauthorizedException("Credenciais inválidas. E-mail ou senha incorretos.");
        }

        return jwtTokenUtil.autenticar(user);
    }

    public String authenticateUserByGoogleEmail(AuthGoogleRequestDTO authGoogleRequestDTO){
        Optional<User> existingUser = userRepository.findByEmailAndGoogleId(authGoogleRequestDTO.getEmail(), authGoogleRequestDTO.getGoogleId());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            return jwtTokenUtil.autenticar(user);
        }

        Optional<User> userByEmail = userRepository.findByEmail(authGoogleRequestDTO.getEmail());

        if (userByEmail.isPresent()) {
            User user = userByEmail.get();
            user.setGoogleId(authGoogleRequestDTO.getGoogleId());
            userRepository.save(user);

            return jwtTokenUtil.autenticar(user);
        }

        throw new ResourceNotFoundException("Usuário não encontrado.");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));
    }

    public UserResponseDTO findUserResponseDtoByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));
        return userMapper.toUserResponseDTO(user);
    }

    public List<UserResponseDTO> findAllUsersDTO() {

        return userRepository.findAll().stream()
                .map(userMapper::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void seguirCampanha(Long idUsuario, Long idCampanha) {

        User user = findUserById(idUsuario);

        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + idCampanha));

        if (user.getCampanhasSeguidas().contains(campanha)) {
            throw new BadRequestException("Usuário já segue esta campanha.");
        }

        user.getCampanhasSeguidas().add(campanha);
        userRepository.save(user);
    }

    @Transactional
    public void pararDeSeguirCampanha(Long idUsuario, Long idCampanha) {

        User user = findUserById(idUsuario);

        Campanha campanha = campanhaRepository.findById(idCampanha)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha não encontrada com o ID: " + idCampanha));

        if (!user.getCampanhasSeguidas().contains(campanha)) {
            throw new BadRequestException("Usuário não segue esta campanha.");
        }

        user.getCampanhasSeguidas().remove(campanha);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<CampanhaResponseDTO> findCampanhasSeguidasByUsuario(Long idUsuario) {

        User user = findUserById(idUsuario);

        return user.getCampanhasSeguidas().stream()
                .map(campanhaMapper::entityToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
    }
}