package com.utfpr.donare.repository;

import com.utfpr.donare.model.Necessidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NecessidadeRepository extends JpaRepository<Necessidade, Long> {
    List<Necessidade> findByCampanhaIdOrderByDataCriacaoDesc(Long campanhaId);
}
