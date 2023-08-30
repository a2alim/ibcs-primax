package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.DppFiscalYear;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DppFiscalYearRepository extends ServiceRepository<DppFiscalYear> {

    List<DppFiscalYear> findByDppAnnualPhasingCostTabDetailsIdAndIsDeleted(Long dppAnnualPhasingCostTabDetailsId, Boolean isDeleted);

    List<DppFiscalYear> findByDppAnnualPhasingCostTabDetailsIdInAndIsDeleted(Set<Long> dppAnnualPhasingCostTabDetailsIds, Boolean isDeleted);

    @Query(value = "select * from dpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.dpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.project_concept_id = :conceptId))", nativeQuery = true)
    List<DppFiscalYear> getByProjectConceptIdAndComponentName(Long conceptId, int dppAnnualPhasing);
}
