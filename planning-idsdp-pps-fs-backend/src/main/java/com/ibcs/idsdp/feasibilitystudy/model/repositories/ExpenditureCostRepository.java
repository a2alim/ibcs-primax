package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ExpenditureCost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExpenditureCostRepository extends ServiceRepository<ExpenditureCost> {

    Page<ExpenditureCost> findAllByFspMasterIdAndIsDeletedOrderByIdDesc(Long fspMasterId, Boolean isDeleted, Pageable pageable);

    List<ExpenditureCost> findAllByFspMasterIdAndIsDeleted(Long fspMasterId, boolean isDeleted);
}
