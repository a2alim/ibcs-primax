package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;


public interface MinistryDivisionRepository extends ServiceRepository<MinistryDivision> {

    Page<MinistryDivision> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    MinistryDivision findByIdAndStatusAndIsDeleted(long id, Boolean status, Boolean isDelete);

    Optional<MinistryDivision> findById(Long id);

    MinistryDivision findByNameEnAndIsDeleted(String nameEn, Boolean isDelete);
    MinistryDivision findByCodeAndIsDeleted(String code, Boolean isDelete);
}
