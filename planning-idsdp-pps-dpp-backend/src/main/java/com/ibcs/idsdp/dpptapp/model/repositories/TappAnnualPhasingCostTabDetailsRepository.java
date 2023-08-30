package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCostTabDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TappAnnualPhasingCostTabDetailsRepository extends ServiceRepository<TappAnnualPhasingCostTabDetails> {

    List<TappAnnualPhasingCostTabDetails> findByTappAnnualPhasingCostIdAndIsDeleted(Long tappAnnualPhasingCostId, Boolean isDeleted);
}
