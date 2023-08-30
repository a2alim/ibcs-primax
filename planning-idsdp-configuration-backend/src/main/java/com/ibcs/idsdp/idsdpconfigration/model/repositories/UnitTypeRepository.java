package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UnitType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UnitTypeRepository extends ServiceRepository<UnitType> {
    Page<UnitType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    UnitType findByIdAndStatusAndIsDeleted(Long id, Boolean status, Boolean isDelete);
}
