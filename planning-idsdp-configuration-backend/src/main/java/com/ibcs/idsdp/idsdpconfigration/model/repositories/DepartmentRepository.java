package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Department;
import com.ibcs.idsdp.idsdpconfigration.model.domain.JustificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepartmentRepository extends ServiceRepository<Department> {
    Page<Department> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    Department findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);
}
