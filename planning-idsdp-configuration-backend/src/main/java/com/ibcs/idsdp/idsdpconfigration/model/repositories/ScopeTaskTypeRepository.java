package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ScopeTaskType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScopeTaskTypeRepository extends ServiceRepository<ScopeTaskType> {
    Page<ScopeTaskType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    ScopeTaskType findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
