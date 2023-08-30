package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.RiskAnalysis;

public interface RiskAnalysisRepository extends ServiceRepository<RiskAnalysis> {

    RiskAnalysis findAllByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDelete);

    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
