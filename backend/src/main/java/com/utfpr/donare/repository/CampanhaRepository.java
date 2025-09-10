package com.utfpr.donare.repository;

import com.utfpr.donare.domain.Campanha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampanhaRepository extends JpaRepository<Campanha, Long>, JpaSpecificationExecutor<Campanha> {
    @Modifying
    @Query("UPDATE Campanha c SET c.ativo = false WHERE c.id = :id")
    void deletePorId(@Param("id") Long id);

    List<Campanha> findAllByAtivoTrue();

    Optional<Campanha> findByIdAndAtivoTrue(Long id);
}

