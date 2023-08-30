package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappModeOfFinancing;

import java.util.Optional;

public interface TappModeOnFinanceRepository extends ServiceRepository<TappModeOfFinancing> {

      Optional<TappModeOfFinancing> findByTappObjectiveCostIdAndIsDeleted(Long tappMasterId, Boolean isDelete);

}
