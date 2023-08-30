package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementMethod;

import java.util.List;

public interface ProcurementMethodRepository extends ServiceRepository<ProcurementMethod> {
    List<ProcurementMethod> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
