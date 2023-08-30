package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
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
            "and (is_basis = :isBasis or is_major = :isMajor) " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.project_concept_id = :pcId)", nativeQuery = true)
    List<DppAnnualPhasingCostTabDetails> findAllByProjectConceptIdAndIsBasisOrIsMajor(Long pcId, Boolean isBasis, Boolean isMajor);

    @Query(value = "select * \n" +
            "from dpp_annual_phasing_cost_tab_details dapctd \n" +
            "where dapctd .is_deleted = false \n" +
            "and (is_basis = :isBasis or is_major = :isMajor) \n" +
            "and dapctd.dpp_annual_phasing_cost_id in \n" +
            "(select dapc.id from dpp_annual_phasing_cost dapc \n" +
            "where dapc.is_deleted = false \n" +
            "and dapc.project_concept_uuid = :pcUuid)", nativeQuery = true)
    List<DppAnnualPhasingCostTabDetails> findAllByProjectConceptUuidAndIsBasisOrIsMajor(String pcUuid, Boolean isBasis, Boolean isMajor);

    @Query(value = "select sum(coalesce(dapctd.total_amount, 0)) " +
            "from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd .is_deleted = false " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.project_concept_id = :pcId)", nativeQuery = true)
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
