package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseDeskOfficer;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;

@Repository
public interface CommitteeSetupRepository extends ServiceRepository<CommitteeSetup>{
	
	List<CommitteeSetup> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

}
