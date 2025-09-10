package com.utfpr.donare.repository;

import com.utfpr.donare.domain.Postagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findByCampanhaIdOrderByDataCriacaoDesc(Long campanhaId);
}

