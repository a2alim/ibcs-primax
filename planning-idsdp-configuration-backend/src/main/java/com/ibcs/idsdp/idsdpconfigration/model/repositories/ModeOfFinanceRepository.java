package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ModeOfFinance;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ModeOfFinanceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ModeOfFinanceRepository extends ServiceRepository<ModeOfFinance> {

    Page<ModeOfFinance> findAllByStatusAndIsDeleted(Boolean status, Boolean isDelete, Pageable pageable);

    Page<ModeOfFinance> findAllByStatusAndIsDeletedOrderByOrderIdAsc(Boolean status, Boolean isDelete, Pageable pageable);

    List<ModeOfFinance> findByStatusAndIsDeleted(Boolean status, Boolean isDelete);
}
