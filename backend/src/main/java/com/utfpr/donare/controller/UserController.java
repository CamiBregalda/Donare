package com.utfpr.donare.controller;

import com.utfpr.donare.dto.*;
import com.utfpr.donare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

//cors
   import org.springframework.context.annotation.Bean;
   import org.springframework.web.servlet.config.annotation.CorsRegistry;
   import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@RequiredArgsConstructor
@RequestMapping(path = "usuarios")
@RestController
public class UserController {

    private final UserService userService;

    @Operation(summary = "Cria um novo usuário.", description = "Registra um novo usuário no sistema com as informações fornecidas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = UserResponseDTO.class))),

            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos, e-mail/CPF/CNPJ já cadastrado, formato inválido).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(path = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> save(
            @Valid @RequestPart("user") UserRequestDTO userRequestDTO,
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        return new ResponseEntity<>(userService.save(userRequestDTO, midia), HttpStatus.CREATED);
    }


    @Operation(summary = "Autentica um usuário.", description = "Recebe e-mail e senha para autenticar o usuário e retornar um token JWT.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida, token JWT retornado.",
                    content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE,
                            schema = @Schema(type = "string", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(path = "/authenticate", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public String authenticate(@Valid @RequestBody AuthRequestDTO authRequestDTO) {

        return userService.autenticar(authRequestDTO.getEmail(), authRequestDTO.getPassword());
    }

    @Operation(summary = "Retorna todos os usuários.",
            description = "Recupera uma lista de todos os usuários cadastrados no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserResponseDTO>> findAll() {

        return ResponseEntity.ok(userService.findAllUsersDTO());
    }

    @Operation(summary = "Atualiza um usuário existente.", description = "Atualiza as informações de um usuário específico pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos, e-mail/CPF/CNPJ já em uso por outro usuário).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponseDTO> update(
            @Parameter(description = "ID do usuário a ser atualizado.", required = true, example = "1")
            @PathVariable Long id,
            @Valid @RequestPart("user") UserRequestDTO userRequestDTO,
            @RequestPart(value = "midia", required = false) MultipartFile midia) {

        UserResponseDTO updatedUser = userService.update(id, userRequestDTO, midia);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @Operation(summary = "Atualiza a senha de um usuário existente.", description = "Atualiza a senha de um usuário específico pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: dados incompletos, e-mail/CPF/CNPJ já em uso por outro usuário).",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping(path = "/alterarSenha/{id}")
    public ResponseEntity<UserResponseDTO> updatePassword(
            @Parameter(description = "ID do usuário a ser atualizado.", required = true, example = "1")
            @PathVariable Long id,
            @Valid @RequestBody UserPasswordRequestDTO userPasswordRequestDTO){

        UserResponseDTO updatedUser = userService.updatePassword(id, userPasswordRequestDTO);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }



    @Operation(summary = "Deleta um usuário.", description = "Exclui um usuário do sistema pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuário deletado com sucesso (sem conteúdo de resposta)."),

            @ApiResponse(responseCode = "404", description = "Usuário não encontrado para o ID informado.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorResponse.class))),

            @ApiResponse(responseCode = "500", description = "Erro interno do servidor.",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do usuário a ser deletado.", required = true, example = "1")
            @PathVariable Long id) {

        userService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<UserResponseDTO> findById(
            @Parameter(description = "ID do usuário a ser encontra.", required = true, example = "1")
            @PathVariable Long id) {

        return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
    }

    @GetMapping(path = "email/{email}")
    public ResponseEntity<UserResponseDTO> findByEmail(
            @Parameter(description = "E-mail do usuário a ser encontra.", required = true, example = "david@mail.com")
            @PathVariable String email) {

        return new ResponseEntity<>(userService.findUserResponseDtoByEmail(email), HttpStatus.OK);
    }
}