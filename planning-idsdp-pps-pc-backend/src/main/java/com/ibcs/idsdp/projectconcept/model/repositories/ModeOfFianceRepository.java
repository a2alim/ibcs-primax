package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.ModeOfFinance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ModeOfFianceRepository extends ServiceRepository<ModeOfFinance> {

    Page<ModeOfFinance> findAllByProjectConceptMasterIdAndIsDeletedOrderByIdDesc(Long projectSummaryId, Boolean isDeleted, Pageable pageable);

    List<ModeOfFinance> findAllByProjectConceptMasterIdAndIsDeletedOrderByIdDesc(Long projectSummaryId, Boolean isDeleted);
}
