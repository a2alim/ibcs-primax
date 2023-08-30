package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementType;

import java.util.List;

public interface ProcurementTypeRepository extends ServiceRepository<ProcurementType> {
    List<ProcurementType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
