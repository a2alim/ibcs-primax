package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.PscWorkingPlan;

import java.util.Optional;

public interface PscWorkingPlanRepository extends ServiceRepository<PscWorkingPlan> {
    Optional<PscWorkingPlan> findByProjectConceptUuidAndPscPaperTypeAndUserType(String pcUuid, String pscPaperType, String userType);
    Optional<PscWorkingPlan> findByProjectConceptUuid(String uuid);
}
