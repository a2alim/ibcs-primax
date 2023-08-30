package com.ibcs.idsdp.rdpprtapp.model.repositories;


import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLocationWiseBreakdown;

import java.util.List;

public interface DppLocationWiseBreakdownRepository extends ServiceRepository<DppLocationWiseBreakdown> {

    List<DppLocationWiseBreakdown> findAllByProjectConceptMasterIdAndIsDeleted(Long id, Boolean isDeleted);

    List<DppLocationWiseBreakdown> findAllByRdppMasterIdAndIsDeleted(Long id, Boolean isDeleted);

}
