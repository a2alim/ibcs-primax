package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmountLetter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RmsEvaluatorsGrantAmountLetterRepository extends ServiceRepository<RmsEvaluatorsGrantAmountLetter> {

    Page<RmsEvaluatorsGrantAmountLetter> findAllByStFiscalYearIdAndIsDeleted(Long fiscalYearId, Boolean isDeleted, Pageable pageable);

}
