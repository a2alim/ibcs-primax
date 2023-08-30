package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;

import java.util.List;

public interface EconomicCodeRepository extends ServiceRepository<EconomicCode> {
    List<EconomicCode> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
