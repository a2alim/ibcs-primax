package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.MarketAnalysis;

public interface MarketAnalysisRepository extends ServiceRepository<MarketAnalysis> {

    MarketAnalysis findAllByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDelete);

    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
