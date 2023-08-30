package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.ImsModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImsModuleRepository extends ServiceRepository<ImsModule> {
    List<ImsModule> findAllByIsActiveAndIsDeletedOrderByIdAsc(Boolean isActive, Boolean isDeleted);
    List<ImsModule> findAllByIsDevelopmentModuleAndIsActiveAndIsDeletedOrderByIdAsc(Boolean isDevelopmentModule, Boolean isActive, Boolean isDeleted);

    Page<ImsModule> findAllByIsDeletedAndIsActive(Boolean isDelete, Boolean isActive, Pageable pageable);

    @Query(value = "select * from ims_module m \n" +
            "where m.is_deleted = :isDeleted and m.is_active = :isActive and (lower(m.module_name) like %:value% or lower(m.module_full_name) like %:value% )",
            countQuery = "SELECT count(*) FROM ims_module", nativeQuery = true)
    Page<ImsModule> findAllByPageable(boolean isDeleted, boolean isActive, String value, Pageable pageable);


}
