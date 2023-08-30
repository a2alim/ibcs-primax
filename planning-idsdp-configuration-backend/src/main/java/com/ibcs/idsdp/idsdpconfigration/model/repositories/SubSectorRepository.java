package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubSector;

import java.util.List;
import java.util.Optional;

public interface SubSectorRepository extends ServiceRepository<SubSector> {

    List<SubSector> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<SubSector> findAllBySectorIdAndStatusAndIsDeleted(Long subSectorId, Boolean status, Boolean isDelete);

    Optional<SubSector> findBySubSectorNameEnAndIsDeleted(String subSectorNameEn, Boolean IsDeleted);

    Optional<SubSector> findBySubSectorCodeAndIsDeleted(String subSectorCode, Boolean IsDeleted);
}
