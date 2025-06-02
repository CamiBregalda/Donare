package com.utfpr.donare.mapper;

import com.utfpr.donare.domain.Comentario;
import com.utfpr.donare.dto.ComentarioRequestDTO;
import com.utfpr.donare.dto.ComentarioResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComentarioMapper {
    Comentario toComentario(ComentarioRequestDTO comentarioRequestDTO);

    Comentario toComentario(ComentarioResponseDTO comentarioResponseDTO);

    ComentarioRequestDTO toComentarioRequestDTO(Comentario comentario);

    ComentarioResponseDTO toComentarioResponseDTO(Comentario comentario);
}
