package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCost;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DppAnnualPhasingCostRepository extends ServiceRepository<DppAnnualPhasingCost> {

    List<DppAnnualPhasingCost> findAllByProjectConceptId(String id);

    Optional<DppAnnualPhasingCost> findByProjectConceptIdAndComponentNameAndIsDeleted(Long projectConceptId, DppAnnualPhasing componentName, Boolean isDeleted);

    Optional<DppAnnualPhasingCost> findByProjectConceptUuidAndIsDeletedAndComponentName(String projectConceptId, Boolean isDeleted, DppAnnualPhasing tabName);

    List<DppAnnualPhasingCost> findByProjectConceptIdAndIsDeleted(Long projectConceptId, Boolean isDeleted);

    List<DppAnnualPhasingCost> findAllByProjectConceptUuidAndIsDeleted(String projectConceptUuid, Boolean isDeleted);
}
