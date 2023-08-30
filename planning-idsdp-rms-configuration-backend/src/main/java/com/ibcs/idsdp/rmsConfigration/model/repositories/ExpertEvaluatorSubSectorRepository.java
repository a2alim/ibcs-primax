package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluatorBySsrc;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluatorSectorSubSector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertEvaluatorSubSectorRepository extends JpaRepository<ExpertEvaluatorSectorSubSector, Long> {
}
