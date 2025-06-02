package com.utfpr.donare.repository;

import com.utfpr.donare.domain.Necessidade;
import com.utfpr.donare.domain.Participacao;
import com.utfpr.donare.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipacaoRepository extends JpaRepository<Participacao, Long> {
    List<Participacao> findByCampanhaId(Long campanhaId);
}
