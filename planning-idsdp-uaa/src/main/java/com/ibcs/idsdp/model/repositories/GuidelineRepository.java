package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Guideline;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.model.domain.Resources;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GuidelineRepository extends ServiceRepository<Guideline> {
    List<Guideline> findAllByIsActiveAndIsDeletedOrderById(Boolean isActive, Boolean isDeleted);
    List<Guideline> findAllByImsModuleIdAndIsActiveAndIsDeletedOrderById(String imsModuleId, Boolean isActive, Boolean isDeleted);

    @Query(value = "select * from guideline g \n" +
            "where g.is_deleted = :isDeleted and g.is_active = :isActive  \n" +
            "\t and (lower(g.ims_module_name) like %:value% or lower(g.description) like %:value% or lower(g.title) like %:value%)",
            countQuery = "SELECT count(*) FROM guideline", nativeQuery = true)
    Page<Guideline> findAllByPageable(boolean isDeleted, boolean isActive, String value, Pageable pageable);

}
