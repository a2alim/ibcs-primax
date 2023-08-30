package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLogFrame;

import java.util.Optional;

public interface LogFrameRepository extends ServiceRepository<DppLogFrame> {
//    List<DppLogFrame> findAllByStatus(Boolean status);

    Optional<DppLogFrame> findAllByProjectConceptUuid(String pcUuid);

    Optional<DppLogFrame> findByRdppMasterId(Long id);

    DppLogFrame findByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDelete);
}
