package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCostTabDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DppAnnualPhasingCostTabDetailsRepository extends ServiceRepository<DppAnnualPhasingCostTabDetails> {

    List<DppAnnualPhasingCostTabDetails> findByDppAnnualPhasingCostIdAndIsDeleted(Long dppAnnualPhasingCostId, Boolean isDeleted);

    Optional<List<DppAnnualPhasingCostTabDetails>> findAllByIsMajor(Boolean isMajor);

    @Query(value = "select * " +
            "from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd .is_deleted = false " +
            "and is_major = :isMajor " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.project_concept_id = :pcId)", nativeQuery = true)
    List<DppAnnualPhasingCostTabDetails> findAllByProjectConceptIdAndIsMajor(Long pcId, Boolean isMajor);

    @Query(value = "select sum(coalesce(dapctd.total_amount, 0)) " +
            "from rdpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd .is_deleted = false " +
            "and dapctd.rdpp_annual_phasing_cost_id in " +
            "(select dapc.id from rdpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.rdpp_master_id = :pcId)", nativeQuery = true)
    Double getTotalAmountByProjectConceptUuid(Long pcId);

    @Query(value = "select * from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.economic_code_id > 0 " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.project_concept_id = :conceptId)", nativeQuery = true)
    List<DppAnnualPhasingCostTabDetails> findAllByProjectConceptId(Long conceptId);
//
//    @Query(value = "select distinct (dapctd.unit_id) from dpp_annual_phasing_cost_tab_details dapctd " +
//            "where dapctd.is_deleted = false " +
//            "and dapctd.unit_id > 0 " +
//            "and dapctd.dpp_annual_phasing_cost_id in " +
//            "(select dapc.id from dpp_annual_phasing_cost dapc " +
//            "where dapc.is_deleted = false " +
//            "and dapc.project_concept_id = :conceptId)", nativeQuery = true)
//    Set<Long> findAllUnitIdByProjectConceptId(Long conceptId);
}
