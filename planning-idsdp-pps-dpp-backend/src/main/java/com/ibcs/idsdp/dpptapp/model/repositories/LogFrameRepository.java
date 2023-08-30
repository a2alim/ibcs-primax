package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;

import java.util.List;
import java.util.Optional;

public interface LogFrameRepository extends ServiceRepository<DppLogFrame> {
//    List<DppLogFrame> findAllByStatus(Boolean status);

    Optional<DppLogFrame> findAllByProjectConceptUuid(String pcUuid);

    DppLogFrame findByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDelete);
}
