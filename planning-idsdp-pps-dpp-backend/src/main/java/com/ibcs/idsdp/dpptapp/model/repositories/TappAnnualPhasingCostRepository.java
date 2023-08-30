package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCost;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TappAnnualPhasingCostRepository extends ServiceRepository<TappAnnualPhasingCost> {

    List<TappAnnualPhasingCost> findAllByProjectConceptId(String id);

    Optional<TappAnnualPhasingCost> findByProjectConceptIdAndComponentNameAndIsDeleted(Long projectConceptId, DppAnnualPhasing componentName, Boolean isDeleted);

    Optional<TappAnnualPhasingCost> findByProjectConceptUuidAndIsDeletedAndComponentName(String projectConceptId, Boolean isDeleted, DppAnnualPhasing tabName);

    List<TappAnnualPhasingCost> findAllByProjectConceptUuidAndIsDeleted(String projectConceptUuid, Boolean isDeleted);
}
