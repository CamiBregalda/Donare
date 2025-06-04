package com.utfpr.donare.service;

import com.utfpr.donare.mapper.EnderecoMapper;
import com.utfpr.donare.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final EnderecoMapper enderecoMapper;
}