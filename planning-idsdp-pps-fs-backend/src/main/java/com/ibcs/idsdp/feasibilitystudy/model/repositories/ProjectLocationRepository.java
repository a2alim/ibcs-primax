package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ProjectLocation;

public interface ProjectLocationRepository extends ServiceRepository<ProjectLocation> {
    ProjectLocation findByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
    boolean existsByFsrMasterIdAndIsDeleted(Long fsrMasterId, Boolean isDeleted);
}
