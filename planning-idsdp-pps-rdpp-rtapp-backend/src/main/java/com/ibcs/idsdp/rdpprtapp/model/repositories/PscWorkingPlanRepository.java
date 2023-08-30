package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.PscWorkingPlan;

import java.util.Optional;

public interface PscWorkingPlanRepository extends ServiceRepository<PscWorkingPlan> {
    Optional<PscWorkingPlan> findByProjectConceptMasterId(Long id);
    Optional<PscWorkingPlan> findByProjectConceptUuid(String uuid);
}
