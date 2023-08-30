package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VisitPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VisitPlanRepository extends ServiceRepository<VisitPlan> {
    Page<VisitPlan> findAllByFspMasterIdAndIsDeletedOrderByIdDesc(Long fspMasterId, Boolean isDeleted, Pageable pageable);
}
