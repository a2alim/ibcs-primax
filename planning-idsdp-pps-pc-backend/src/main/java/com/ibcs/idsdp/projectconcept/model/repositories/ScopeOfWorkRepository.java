package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.ScopeOfWork;

import java.util.List;
import java.util.Optional;

public interface ScopeOfWorkRepository extends ServiceRepository<ScopeOfWork> {
    List<ScopeOfWork> findAllByProjectConceptMasterIdAndIsDeleted(Long id, Boolean isDelete);
    Optional<ScopeOfWork> findByUuid(String id);
}
