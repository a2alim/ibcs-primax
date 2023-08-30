package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.GisLocation;


public interface GisLocationRepository extends ServiceRepository<GisLocation> {
    void deleteAllBySourceModuleIdAndSourceModuleType(Long sourceModuleId, String sourceModuleType);
}
