package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AgencyRepository extends ServiceRepository<Agency> {

    Page<Agency> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    List<Agency> findAllByMinistryDivisionIdAndStatusAndIsDeleted(Long ministryDivisionId, Boolean status, Boolean isDelete);

    Optional<Agency> findById(Long id);

    Agency findByNameEnAndIsDeleted(String nameEn, Boolean isDelete);

    List<Agency> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    Agency findByCodeAndIsDeleted(String code, Boolean isDelete);
}
