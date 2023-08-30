package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectMovementRepository extends ServiceRepository<ProjectMovement> {

    Page<ProjectMovement> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    Page<ProjectMovement> findAllByStatusAndIsDeletedOrderByOrderIdAsc(Boolean status, Boolean isDelete, Pageable pageable);

    List<ProjectMovement> findAllByStatusAndIsDeletedAndModuleIdOrderByOrderIdAsc(Boolean status, Boolean isDelete, Long moduleId);

    ProjectMovement findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);

}