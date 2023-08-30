package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppMtbf;

import java.util.List;


public interface DppMtbfRepository extends ServiceRepository<DppMtbf> {
    List<DppMtbf> findAllByProjectConceptUuidAndIsDeleted(String projectConceptUuid, Boolean isDeleted);
}
