package com.ibcs.idsdp.dpptapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCostTotal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TappAnnualPhasingCostTotalRepository extends ServiceRepository<TappAnnualPhasingCostTotal> {

    @Query(value = "select * from tapp_annual_phasing_cost_total tapct " +
            "where tapct.is_deleted  = false " +
            "and tapct.id in " +
            "(select distinct (tfy.tapp_annual_phasing_cost_total_id) from tapp_fiscal_year tfy " +
            "where tfy.is_deleted  = false " +
            "and tfy.tapp_annual_phasing_cost_tab_details_id in " +
            "(select tapctd.id from tapp_annual_phasing_cost_tab_details tapctd " +
            "where tapctd.is_deleted = false " +
            "and tapctd.tapp_annual_phasing_cost_id in " +
            "(select tapc.id from tapp_annual_phasing_cost tapc " +
            "where tapc.is_deleted = false " +
            "and tapc.component_name = :tappAnnualPhasing " +
            "and tapc.project_concept_id = :conceptId)))", nativeQuery = true)
    List<TappAnnualPhasingCostTotal> getByProjectConceptIdAndComponentName(Long conceptId, int tappAnnualPhasing);

    @Query(value = "select * from tapp_annual_phasing_cost_total tapct " +
            "where tapct.is_deleted  = false " +
            "and tapct.fiscal_year = :fiscalYear " +
            "and tapct.id in " +
            "(select distinct (tfy.tapp_annual_phasing_cost_total_id) from tapp_fiscal_year tfy " +
            "where tfy.is_deleted  = false " +
            "and tfy.tapp_annual_phasing_cost_tab_details_id in " +
            "(select tapctd.id from tapp_annual_phasing_cost_tab_details tapctd " +
            "where tapctd.is_deleted = false " +
            "and tapctd.tapp_annual_phasing_cost_id in " +
            "(select tapc.id from tapp_annual_phasing_cost tapc " +
            "where tapc.is_deleted = false " +
            "and tapc.component_name = :tappAnnualPhasing " +
            "and tapc.project_concept_id = :conceptId)))", nativeQuery = true)
    TappAnnualPhasingCostTotal getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, int tappAnnualPhasing, String fiscalYear);
}
