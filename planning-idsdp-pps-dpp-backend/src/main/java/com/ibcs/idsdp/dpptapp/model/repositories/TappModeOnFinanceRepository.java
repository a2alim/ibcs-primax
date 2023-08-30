package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappModeOfFinancing;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TappModeOnFinanceRepository extends ServiceRepository<TappModeOfFinancing> {

      Optional<TappModeOfFinancing> findByTappObjectiveCostIdAndIsDeleted(Long tappMasterId, Boolean isDelete);

}
