package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.JustificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JustificationTypeRepository extends ServiceRepository<JustificationType> {
    Page<JustificationType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    JustificationType findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
