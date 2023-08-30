package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnualPhasingCostTotal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TappAnnualPhasingCostTotalRepository extends ServiceRepository<TappAnnualPhasingCostTotal> {

    @Query(value = "select * from rtapp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.id in " +
            "(select distinct (dfy.rtapp_annual_phasing_cost_total_id) from rtapp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.rtapp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from rtapp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.rtapp_annual_phasing_cost_id in " +
            "(select dapc.id from rtapp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.rtapp_master_id = :conceptId)))", nativeQuery = true)
    List<TappAnnualPhasingCostTotal> getByProjectConceptIdAndComponentName(Long conceptId, int dppAnnualPhasing);

    @Query(value = "select * from rtapp_annual_phasing_cost_total dapct " +
            "where dapct.is_deleted  = false " +
            "and dapct.fiscal_year = :fiscalYear " +
            "and dapct.id in " +
            "(select distinct (dfy.rtapp_annual_phasing_cost_total_id) from rtapp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.rtapp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from rtapp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.rtapp_annual_phasing_cost_id in " +
            "(select dapc.id from rtapp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.rtapp_master_id = :conceptId)))", nativeQuery = true)
    TappAnnualPhasingCostTotal getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, int dppAnnualPhasing, String fiscalYear);
}
