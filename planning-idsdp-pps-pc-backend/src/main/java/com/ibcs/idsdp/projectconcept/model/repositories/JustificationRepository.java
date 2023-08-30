package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.Justification;

import java.util.List;
import java.util.Optional;

public interface JustificationRepository extends ServiceRepository<Justification> {
    List<Justification> findAllByProjectConceptMasterIdAndIsDeleted(Long id, Boolean isDelete);
    Optional<Justification> findByUuid(String id);
}
