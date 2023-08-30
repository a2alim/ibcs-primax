package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudget;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface FiscalYearWiseBudgetRepository extends ServiceRepository<FiscalYearWiseBudget> {

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    List<FiscalYearWiseBudget> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    Optional<FiscalYearWiseBudget> findByFiscalYearIdAndIsDeleted(Long fiscalYearId,Boolean isDeleted);

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    @Query(value = "SELECT * from st_fiscal_year_wise_budget  where is_deleted=false and st_fiscal_year_id=? and id<>?",nativeQuery = true)
    Optional<FiscalYearWiseBudget> findByFiscalYearIdUpdate(Long fiscalYearId,Long id);


}
