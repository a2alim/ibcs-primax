package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.rpm.model.domain.ViewPresentationEvaluatorsFeedback;

@Repository
public interface ViewPresentationEvaluatorsFeedbackRepository extends JpaRepository<ViewPresentationEvaluatorsFeedback, Long> {
	List<ViewPresentationEvaluatorsFeedback> findAllByM2CreateSeminarId(Long m2CreateSeminarId);

}
