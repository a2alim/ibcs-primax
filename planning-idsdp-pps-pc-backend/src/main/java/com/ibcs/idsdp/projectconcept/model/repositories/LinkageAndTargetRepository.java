package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.LinkageAndTarget;

import java.util.List;
import java.util.Optional;

public interface LinkageAndTargetRepository extends ServiceRepository<LinkageAndTarget> {
    List<LinkageAndTarget> findAllByProjectConceptMasterIdAndIsDeleted(Long id, Boolean isDelete);
    Optional<LinkageAndTarget> findByUuid(String id);
}
