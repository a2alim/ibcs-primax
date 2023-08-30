package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FsSummary;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FspSummary;

import java.util.List;
import java.util.Optional;

public interface FsSummaryRepository extends ServiceRepository<FsSummary> {
    FsSummary findAllByProjectConceptMasterUuidAndIsDeleted(String projectConceptMasterUuid, Boolean isDelete);
    FsSummary findAllByProjectConceptMasterIdAndIsDeleted(Long pcId, Boolean isDelete);

    boolean existsByProjectConceptMasterUuidAndIsDeleted(String projectConceptMasterUuid, Boolean isDeleted);

    Optional<FsSummary> findByProjectConceptMasterUuidAndIsDeleted(String uuid, Boolean isDelete);

    List<FsSummary> findAllByDppMasterIdIsNull();

    List<FsSummary> findAllByDppMasterIdIsNullOrProjectConceptMasterUuid(String projectConceptMasterUuid);

    Optional<FsSummary> findByDppMasterId(Long dppMasterId);

}
