package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluator;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluatorEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertEvaluatorEducationRepository extends JpaRepository<ExpertEvaluatorEducation, Long> {
}
