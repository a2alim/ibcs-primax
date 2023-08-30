package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;

import java.util.List;

public interface DivisionRepository extends ServiceRepository<Division> {
    List<Division> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
