package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.rmsConfigration.model.domain.ExpertEvaluator;

@Repository
public interface ExpertEvaluatorRepository extends JpaRepository<ExpertEvaluator, Long> {
	
    List<ExpertEvaluator> findAllByIdInAndIsDeleted(Set<Long> ids, Boolean isDeleted);
    Optional <ExpertEvaluator> findByUserIdAndIsDeleted(Long userId,Boolean isDeleted);
}
