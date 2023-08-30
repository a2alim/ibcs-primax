package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmount;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RmsEvaluatorsGrantAmountRepository extends ServiceRepository<RmsEvaluatorsGrantAmount> {

    List<RmsEvaluatorsGrantAmount> findAllByRmsEvaluatorsGrantAmountLetterIdAndIsDeleted(Long rmsEvaluatorsGrantAmountLetter, Boolean isDeleted);

}
