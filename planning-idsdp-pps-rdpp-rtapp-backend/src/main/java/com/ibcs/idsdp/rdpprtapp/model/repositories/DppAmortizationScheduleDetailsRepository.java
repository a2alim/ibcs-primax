package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppAmortizationScheduleDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DppAmortizationScheduleDetailsRepository extends JpaRepository<DppAmortizationScheduleDetails, Long> {

    List<DppAmortizationScheduleDetails> findAllByProjectConceptMasterId(Long id);
}
