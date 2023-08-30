package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SectorDivision;

import java.util.List;
import java.util.Optional;

public interface SectorDivisionRepository extends ServiceRepository<SectorDivision> {
    List<SectorDivision> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);
    Optional<SectorDivision> findById(Long sectorDivisonId);
}
