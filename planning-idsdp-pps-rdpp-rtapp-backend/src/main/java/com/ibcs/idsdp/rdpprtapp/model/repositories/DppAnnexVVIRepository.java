package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnexVVI;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DppAnnexVVIRepository extends JpaRepository<DppAnnexVVI, Long> {
    DppAnnexVVI findByUuid(String uuid);

    Optional<DppAnnexVVI> findByProjectConceptUuid(String projectId);

    Optional<DppAnnexVVI> findByProjectConceptMasterId(Long id);

    Optional<DppAnnexVVI> findAllByProjectConceptUuid(String id);
}
