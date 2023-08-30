package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.PASource;

import java.util.List;

public interface PASourceRepository extends ServiceRepository<PASource> {
    List<PASource> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
