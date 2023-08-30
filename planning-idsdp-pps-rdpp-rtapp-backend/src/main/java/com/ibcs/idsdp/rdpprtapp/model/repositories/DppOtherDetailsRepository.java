package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppOtherDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DppOtherDetailsRepository extends JpaRepository<DppOtherDetails, Long> {

    DppOtherDetails findByUuid(String uuid);

    DppOtherDetails findByProjectConceptUuid(String projectId);

    Optional<DppOtherDetails> findAllByProjectConceptUuid(String id);
}
