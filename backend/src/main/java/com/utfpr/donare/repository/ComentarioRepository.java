package com.utfpr.donare.repository;

import com.utfpr.donare.domain.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByCampanhaIdOrderByDataCriacaoDesc(Long campanhaId);
}
