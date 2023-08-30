package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnexureThree;

import java.util.List;
import java.util.Optional;


public interface TappAnnexureThreeRepository extends ServiceRepository<TappAnnexureThree> {

    Optional<TappAnnexureThree> findByUuid(String id);

    List<TappAnnexureThree> findAllByProjectConceptUuidAndIsDeleted(String id, Boolean isDelete);
};
