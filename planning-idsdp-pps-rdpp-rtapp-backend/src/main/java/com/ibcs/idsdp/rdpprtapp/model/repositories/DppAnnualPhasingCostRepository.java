package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCost;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DppAnnualPhasingCostRepository extends ServiceRepository<DppAnnualPhasingCost> {

    List<DppAnnualPhasingCost> findAllByProjectConceptId(String id);

    Optional<DppAnnualPhasingCost> findByProjectConceptIdAndComponentNameAndIsDeleted(Long projectConceptId, DppAnnualPhasing componentName, Boolean isDeleted);

    Optional<DppAnnualPhasingCost> findByRdppMasterIdAndComponentNameAndIsDeleted(Long projectConceptId, DppAnnualPhasing componentName, Boolean isDeleted);

    Optional<DppAnnualPhasingCost> findByProjectConceptUuidAndIsDeletedAndComponentName(String projectConceptId, Boolean isDeleted, DppAnnualPhasing tabName);

    List<DppAnnualPhasingCost> findByProjectConceptIdAndIsDeleted(Long projectConceptId, Boolean isDeleted);

    List<DppAnnualPhasingCost> findByRdppMasterIdAndIsDeleted(Long rdppMasterId, Boolean isDeleted);

    List<DppAnnualPhasingCost> findAllByProjectConceptUuidAndIsDeleted(String projectConceptUuid, Boolean isDeleted);

    List<DppAnnualPhasingCost> findAllByRdppMasterIdAndIsDeleted(Long id, Boolean isDeleted);
}
