package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchCategoryType;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;

@Repository
public interface FiscalYearRepository extends ServiceRepository<FiscalYear>{

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    List<FiscalYear> findAllByIsDeleted(boolean isDeleted);
    //List<FiscalYear> findAllByIsDeletedAndActive(boolean isDeleted, boolean isActive);
}
