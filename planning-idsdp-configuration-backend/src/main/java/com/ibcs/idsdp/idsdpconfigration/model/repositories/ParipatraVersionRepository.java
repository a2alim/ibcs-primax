package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ParipatraVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ParipatraVersionRepository extends ServiceRepository<ParipatraVersion> {
    Page<ParipatraVersion> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    ParipatraVersion findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);

    ParipatraVersion findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<ParipatraVersion> findAllByStatusAndIsDeletedOrderByIdDesc(Boolean status, Boolean isDelete);
}
