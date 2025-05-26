package com.utfpr.donare.controller;

import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserRequestDTO;
import com.utfpr.donare.dto.UserResponseDTO;
import com.utfpr.donare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(path = "usuarios")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping(path = "")
    public ResponseEntity<UserResponseDTO> save(@RequestBody UserRequestDTO userRequestDTO) {
        return new ResponseEntity<>(userService.save(userRequestDTO), HttpStatus.CREATED);
    }

    @PostMapping(path = "/autenticate")
    public String autenticate(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.autenticar(userRequestDTO.getEmail(), userRequestDTO.getPassword());
    }

    @GetMapping("")
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        userService.update(id, userRequestDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
