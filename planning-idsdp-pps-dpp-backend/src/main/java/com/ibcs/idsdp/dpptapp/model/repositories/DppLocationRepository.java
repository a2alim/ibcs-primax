package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppLocation;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;

public interface DppLocationRepository extends ServiceRepository<DppLocation> {

    DppLocation findByIsDeleted(Boolean isDeleted);

    DppLocation findByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDeleted);

    DppLocation findByDppMasterIdAndIsDeleted(Long dppMasterId, Boolean isDeleted);

    boolean existsByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDeleted);


}
