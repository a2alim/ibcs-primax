package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TppAnnexureFive;

import java.util.List;
import java.util.Optional;

public interface TppAnnexureFiveRepository extends ServiceRepository<TppAnnexureFive> {
    Optional<TppAnnexureFive> findById(Long id);

    List<TppAnnexureFive> findByProjectConceptUuidAndIsDeleted(String uuid, Boolean isDelete);
}
