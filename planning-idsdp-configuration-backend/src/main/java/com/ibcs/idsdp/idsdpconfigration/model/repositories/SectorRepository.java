package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Sector;

import java.util.List;

public interface SectorRepository extends ServiceRepository<Sector> {
    List<Sector> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete);

    List<Sector> findBySectorDivisionIdAndStatusAndIsDeleted(Long sectorDivisionId, Boolean status, Boolean isDelete);
}
