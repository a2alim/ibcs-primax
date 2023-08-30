package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagementSetup;

import java.util.List;
import java.util.Optional;

public interface DppProjectManagementSetupRepository extends ServiceRepository<DppProjectManagementSetup> {

    List<DppProjectManagementSetup> findAllByProjectConceptUuidAndIsDeletedOrderByIdAsc(String id, Boolean isDelete);

    List<DppProjectManagementSetup> findByProjectConceptUuid(String id);
//    Optional<DppProjectManagementSetup> findByProjectId(String id);

    Optional<DppProjectManagementSetup> findByUuid(String id);

}
