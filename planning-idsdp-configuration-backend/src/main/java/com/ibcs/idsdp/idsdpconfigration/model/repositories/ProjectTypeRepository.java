package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectTypeRepository extends ServiceRepository<ProjectType> {
    Page<ProjectType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    List<ProjectType> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    ProjectType findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);

    ProjectType findByNameEnAndIsDeleted(String nameEn, Boolean isDeleted);
}
