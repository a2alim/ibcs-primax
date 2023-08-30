package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTotal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface DppAnnualPhasingCostTotalRepository extends ServiceRepository<DppAnnualPhasingCostTotal> {

    @Query(value = "select * from dpp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.id in " +
            "(select distinct (dfy.dpp_annual_phasing_cost_total_id) from dpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.dpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.project_concept_id = :conceptId)))", nativeQuery = true)
    List<DppAnnualPhasingCostTotal> getByProjectConceptIdAndComponentName(Long conceptId, int dppAnnualPhasing);

    @Query(value = "select * from dpp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.fiscal_year = :fiscalYear " +
            "and dapct.id in " +
            "(select distinct (dfy.dpp_annual_phasing_cost_total_id) from dpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.dpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from dpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.dpp_annual_phasing_cost_id in " +
            "(select dapc.id from dpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.project_concept_id = :conceptId)))", nativeQuery = true)
    DppAnnualPhasingCostTotal getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, int dppAnnualPhasing, String fiscalYear);
}
