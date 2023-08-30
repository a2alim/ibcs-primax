package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppProjectManagement;

import java.util.Optional;

public interface DppProjectManagementRepository extends ServiceRepository<DppProjectManagement> {
//    List<DppProjectManagement> findAllByStatus(Boolean status);

    DppProjectManagement findByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDelete);

    Optional<DppProjectManagement> findAllByProjectConceptUuid(String pcUuid);

    Optional<DppProjectManagement> findByRdppMasterId(Long id);

}
