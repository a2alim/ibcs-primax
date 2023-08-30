package com.ibcs.idsdp.rdpprtapp.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppFiscalYear;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DppFiscalYearRepository extends ServiceRepository<DppFiscalYear> {

    List<DppFiscalYear> findByDppAnnualPhasingCostTabDetailsIdAndIsDeleted(Long dppAnnualPhasingCostTabDetailsId, Boolean isDeleted);

    List<DppFiscalYear> findByDppAnnualPhasingCostTabDetailsIdInAndIsDeleted(Set<Long> dppAnnualPhasingCostTabDetailsIds, Boolean isDeleted);

    @Query(value = "select * from rdpp_fiscal_year dfy " +
            "where dfy.is_deleted  = false " +
            "and dfy.rdpp_annual_phasing_cost_tab_details_id in " +
            "(select dapctd.id from rdpp_annual_phasing_cost_tab_details dapctd " +
            "where dapctd.is_deleted = false " +
            "and dapctd.rdpp_annual_phasing_cost_id in " +
            "(select dapc.id from rdpp_annual_phasing_cost dapc " +
            "where dapc.is_deleted = false " +
            "and dapc.component_name = :dppAnnualPhasing " +
            "and dapc.rdpp_master_id = :rdppMasterId))", nativeQuery = true)
    List<DppFiscalYear> getByProjectConceptIdAndComponentName(Long rdppMasterId, int dppAnnualPhasing);
}
