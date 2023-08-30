package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.ProjectDetailsPartB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectDetailsPartBRepository extends JpaRepository<ProjectDetailsPartB, Long> {
    ProjectDetailsPartB findByUuid(String uuid);

    ProjectDetailsPartB findByProjectConceptUuid(String projectId);

    Optional<ProjectDetailsPartB> findAllByProjectConceptUuid(String id);
}
