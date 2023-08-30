package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappYearCostSummery;

import java.util.List;
import java.util.Optional;

public interface TappYearCostSummeryRepository extends ServiceRepository<TappYearCostSummery> {
    List<TappYearCostSummery> findAllByStatus(Boolean status);

    Optional<TappYearCostSummery> findByProjectSummeryMasterIdAndIsDeletedAndStatus(Long projectSummeryId, boolean isDelete, boolean status);
}
