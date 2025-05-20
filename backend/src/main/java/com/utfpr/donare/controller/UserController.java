package com.utfpr.donare.controller;

import com.utfpr.donare.domain.User;
import com.utfpr.donare.dto.UserDTO;
import com.utfpr.donare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping(path = "user")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping(path = "/create")
    public ResponseEntity<UserDTO> save(@RequestBody UserDTO userDTO) {
        return new ResponseEntity<UserDTO>(userService.save(userDTO), HttpStatus.CREATED);
    }

    @PostMapping(path = "/autenticate")
    public String autenticate(@RequestBody UserDTO userDTO) {
        return userService.autenticar(userDTO.getEmail(), userDTO.getPassword());
    }

    @GetMapping("/user/all")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }
}
