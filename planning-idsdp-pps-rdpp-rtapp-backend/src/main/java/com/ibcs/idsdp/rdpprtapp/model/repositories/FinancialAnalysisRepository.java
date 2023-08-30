package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.FinancialAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FinancialAnalysisRepository extends JpaRepository<FinancialAnalysis, Long> {

//    FinancialAnalysis findByUuid(String uuid);

    Optional<FinancialAnalysis> findByProjectConceptMasterId(Long id);

    Optional<FinancialAnalysis> findByProjectConceptUuid(String id);
}
