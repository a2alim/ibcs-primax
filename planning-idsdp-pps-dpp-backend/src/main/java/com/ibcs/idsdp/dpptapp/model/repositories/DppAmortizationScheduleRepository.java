package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationSchedule;

import java.util.Optional;

public interface DppAmortizationScheduleRepository extends ServiceRepository<DppAmortizationSchedule> {
//    DppAmortizationSchedule findByProjectId(String id);

    Optional<DppAmortizationSchedule> findByProjectConceptUuid(String id);

    DppAmortizationSchedule findAllByProjectConceptUuid(String uuid);

    Optional<DppAmortizationSchedule> findByProjectConceptUuidAndIsDeleted(String pcuuid, boolean status);



}
