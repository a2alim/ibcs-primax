package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCostTotal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DppAnnualPhasingCostTotalRepository extends ServiceRepository<DppAnnualPhasingCostTotal> {

    @Query(value = "select * from rdpp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.id in " +
            "(select distinct (dfy.rdpp_annual_phasing_cost_total_id) from rdpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.rdpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from rdpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.rdpp_annual_phasing_cost_id in " +
            "(select dapc.id from rdpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.rdpp_master_id = :rdppMasterId)))", nativeQuery = true)
    List<DppAnnualPhasingCostTotal> getByRdppMasterIdAndComponentName(Long rdppMasterId, int dppAnnualPhasing);

    @Query(value = "select * from rdpp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.fiscal_year = :fiscalYear " +
            "and dapct.id in " +
            "(select distinct (dfy.rdpp_annual_phasing_cost_total_id) from rdpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.rdpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from rdpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.rdpp_annual_phasing_cost_id in " +
            "(select dapc.id from rdpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.rdpp_master_id = :conceptId)))", nativeQuery = true)
    DppAnnualPhasingCostTotal getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, int dppAnnualPhasing, String fiscalYear);
}
