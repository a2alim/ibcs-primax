package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FspSummary;

public interface FspSummaryRepository extends ServiceRepository<FspSummary> {

    //Get fs proposal by project concept uuid from db
    FspSummary findAllByProjectConceptMasterUuidAndIsDeleted(String projectConceptMasterUuid, Boolean isDelete);

    boolean existsByProjectConceptMasterUuidAndIsDeleted(String projectConceptMasterUuid, Boolean isDeleted);
}
