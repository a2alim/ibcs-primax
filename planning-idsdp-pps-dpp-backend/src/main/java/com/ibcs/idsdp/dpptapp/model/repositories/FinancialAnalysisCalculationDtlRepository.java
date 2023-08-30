package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysisCalculation;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysisCalculationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialAnalysisCalculationDtlRepository extends JpaRepository<FinancialAnalysisCalculationDetails,Long> {

    List<FinancialAnalysisCalculationDetails> findByProjectConceptMasterId(Long projectConceptMasterId);
}
