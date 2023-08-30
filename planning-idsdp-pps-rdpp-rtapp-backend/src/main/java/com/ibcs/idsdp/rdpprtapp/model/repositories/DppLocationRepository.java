package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLocation;

public interface DppLocationRepository extends ServiceRepository<DppLocation> {

    DppLocation findByIsDeleted(Boolean isDeleted);

    DppLocation findByRdppMasterIdAndIsDeleted(Long rdppMasterId, Boolean isDeleted);


}
