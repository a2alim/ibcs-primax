package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationSchedule;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationScheduleDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DppAmortizationScheduleDetailsRepository extends JpaRepository<DppAmortizationScheduleDetails, Long> {

    List<DppAmortizationScheduleDetails> findAllByProjectConceptMasterId(Long id);
}
