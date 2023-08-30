package com.ibcs.idsdp.rmsConfigration.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.Division;


public interface DivisionRepository extends ServiceRepository<Division> {
	
    List<Division> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<Division> findAllByStatusAndIsDeletedOrderByNameEnAsc(Boolean aTrue, Boolean aFalse);
}
