package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureFive;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoods;

import java.util.List;
import java.util.Optional;

public interface TppAnnexureFiveRepository extends ServiceRepository<TppAnnexureFive> {
    Optional<TppAnnexureFive> findById(Long id);

    List<TppAnnexureFive> findByProjectConceptUuidAndIsDeleted(String uuid, Boolean isDelete);
}
