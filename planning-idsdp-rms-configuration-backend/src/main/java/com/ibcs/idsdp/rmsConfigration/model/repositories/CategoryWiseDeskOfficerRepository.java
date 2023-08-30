package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseDeskOfficer;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;

@Repository
public interface CategoryWiseDeskOfficerRepository extends ServiceRepository<CategoryWiseDeskOfficer> {

	List<CategoryWiseDeskOfficer> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

}
