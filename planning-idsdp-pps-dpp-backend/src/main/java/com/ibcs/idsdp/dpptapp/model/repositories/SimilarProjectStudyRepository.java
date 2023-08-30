package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.dpptapp.model.domain.SimilarProjectStudy;
import com.ibcs.idsdp.dpptapp.web.dto.SimilarProjectStudyDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SimilarProjectStudyRepository extends JpaRepository<SimilarProjectStudy, Long> {

    SimilarProjectStudy findByUuid(String uuid);

    SimilarProjectStudy findByProjectConceptUuid(String projectId);

    Optional<SimilarProjectStudy> findAllByProjectConceptUuid(String id);
}
