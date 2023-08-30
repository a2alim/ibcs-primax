package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import com.ibcs.idsdp.rmsConfigration.model.domain.SectorType;

@Repository
public interface SectorTypeRepository extends ServiceRepository<SectorType>{

    List<SectorType> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

}
