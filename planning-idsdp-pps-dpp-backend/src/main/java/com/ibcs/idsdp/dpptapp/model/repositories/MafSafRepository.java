package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.MafSaf;

import java.util.List;


public interface MafSafRepository extends ServiceRepository<MafSaf> {
    List<MafSaf> findAllByProjectConceptUuidAndTypeAndIsDeleted(String projectConceptUuid, String type, Boolean isDeleted);
}
