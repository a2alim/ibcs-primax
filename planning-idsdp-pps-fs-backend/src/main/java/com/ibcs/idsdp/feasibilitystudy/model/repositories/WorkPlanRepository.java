package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.WorkPlan;

import java.util.List;
import java.util.Optional;

public interface WorkPlanRepository extends ServiceRepository<WorkPlan> {
    List<WorkPlan> findAllByFspMasterIdAndIsDeleted(Long fspMasterId, Boolean isDelete);
    Optional<WorkPlan> findByUuid(String id);
}

