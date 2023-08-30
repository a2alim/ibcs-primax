package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.OtherAnalysis;


public interface OtherAnalysisRepository extends ServiceRepository<OtherAnalysis> {

    OtherAnalysis findAllByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDelete);

    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
