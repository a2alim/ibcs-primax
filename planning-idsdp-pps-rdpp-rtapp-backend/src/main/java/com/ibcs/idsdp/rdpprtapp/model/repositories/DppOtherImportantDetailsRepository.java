package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppOtherImportantDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DppOtherImportantDetailsRepository extends JpaRepository<DppOtherImportantDetails, Long> {
    DppOtherImportantDetails findByUuid(String uuid);

    DppOtherImportantDetails findByProjectConceptUuid(String projectId);

    Optional<DppOtherImportantDetails> findAllByProjectConceptUuid(String id);
}
