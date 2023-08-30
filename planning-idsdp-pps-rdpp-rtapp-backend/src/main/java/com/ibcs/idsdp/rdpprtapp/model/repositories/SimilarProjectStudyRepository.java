package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.SimilarProjectStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SimilarProjectStudyRepository extends JpaRepository<SimilarProjectStudy, Long> {

    SimilarProjectStudy findByUuid(String uuid);

    SimilarProjectStudy findByProjectConceptUuid(String projectId);

    Optional<SimilarProjectStudy> findAllByProjectConceptUuid(String id);
}
