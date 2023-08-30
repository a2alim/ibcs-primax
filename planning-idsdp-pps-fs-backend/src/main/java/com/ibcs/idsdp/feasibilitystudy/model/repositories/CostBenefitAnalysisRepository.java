package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.CostBenefitAnalysis;

public interface CostBenefitAnalysisRepository extends ServiceRepository<CostBenefitAnalysis> {

    CostBenefitAnalysis findAllByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDelete);

    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
