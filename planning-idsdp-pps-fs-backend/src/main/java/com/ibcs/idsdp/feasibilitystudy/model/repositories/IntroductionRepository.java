package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Introduction;

public interface IntroductionRepository extends ServiceRepository<Introduction> {
    Introduction findAllByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDelete);

    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
