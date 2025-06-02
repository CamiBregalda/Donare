package com.utfpr.donare.repository;

import com.utfpr.donare.domain.Campanha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CampanhaRepository extends JpaRepository<Campanha, Long>, JpaSpecificationExecutor<Campanha> {
}

