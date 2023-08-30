package com.ibcs.idsdp.dpptapp.model.repositories;


import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppLocationWiseBreakdown;

import java.util.List;

public interface DppLocationWiseBreakdownRepository extends ServiceRepository<DppLocationWiseBreakdown> {

    List<DppLocationWiseBreakdown> findAllByProjectConceptMasterIdAndIsDeleted(Long id, Boolean isDeleted);

    List<DppLocationWiseBreakdown> findAllByDppObjectiveCostIdAndIsDeleted(Long id, Boolean isDeleted);

}
