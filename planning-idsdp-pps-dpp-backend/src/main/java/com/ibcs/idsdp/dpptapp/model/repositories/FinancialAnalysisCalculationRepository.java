package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagementSetup;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysisCalculation;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialAnalysisCalculationRepository extends ServiceRepository<FinancialAnalysisCalculation> {

    FinancialAnalysisCalculation findByProjectConceptMasterIdAndCalculationType(Long projectConceptMasterId, String calculationType);

    FinancialAnalysisCalculation findByUuid(String uuid);
}
