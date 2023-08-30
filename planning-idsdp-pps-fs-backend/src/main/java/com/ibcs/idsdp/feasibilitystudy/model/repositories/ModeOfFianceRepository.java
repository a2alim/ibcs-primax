package com.ibcs.idsdp.feasibilitystudy.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ModeOfFinance;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ModeOfFinanceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ModeOfFianceRepository extends ServiceRepository<ModeOfFinance> {
    Page<ModeOfFinance> findAllByFspMasterIdAndIsDeletedOrderByIdDesc(Long fspMasterId, Boolean isDeleted, Pageable pageable);

    List<ModeOfFinance> findAllByFspMasterIdAndIsDeleted(Long id, boolean isDeleted);
}
