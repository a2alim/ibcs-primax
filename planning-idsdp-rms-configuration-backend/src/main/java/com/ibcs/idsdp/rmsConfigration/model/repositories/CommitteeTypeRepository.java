package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;

@Repository
public interface CommitteeTypeRepository extends ServiceRepository<CommitteeType>{
	
	List<CommitteeType> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

}
