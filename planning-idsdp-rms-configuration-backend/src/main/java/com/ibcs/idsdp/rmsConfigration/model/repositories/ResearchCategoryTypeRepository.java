package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;

@Repository
public interface ResearchCategoryTypeRepository extends ServiceRepository<ResearchCategoryType>{
	
	List<ResearchCategoryType> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

}
