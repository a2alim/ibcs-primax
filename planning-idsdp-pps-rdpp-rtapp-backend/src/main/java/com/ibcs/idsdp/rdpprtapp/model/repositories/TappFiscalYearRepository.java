package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppFiscalYear;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappFiscalYear;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TappFiscalYearRepository extends ServiceRepository<TappFiscalYear> {

    List<TappFiscalYear> findByTappAnnualPhasingCostTabDetailsIdAndIsDeleted(Long tappAnnualPhasingCostTabDetailsId, Boolean isDeleted);

    @Query(value = "select * from rtapp_fiscal_year tfy " +
            "where tfy.is_deleted  = false " +
            "and tfy.rtapp_annual_phasing_cost_tab_details_id in " +
            "(select tapctd.id from rtapp_annual_phasing_cost_tab_details tapctd " +
            "where tapctd.is_deleted = false " +
            "and tapctd.rtapp_annual_phasing_cost_id in " +
            "(select tapc.id from rtapp_annual_phasing_cost tapc " +
            "where tapc.is_deleted = false " +
            "and tapc.component_name = :tappAnnualPhasing " +
            "and tapc.rtapp_master_id = :rtappMasterId))", nativeQuery = true)
    List<TappFiscalYear> getByProjectConceptIdAndComponentName(Long rtappMasterId, int tappAnnualPhasing);

}
