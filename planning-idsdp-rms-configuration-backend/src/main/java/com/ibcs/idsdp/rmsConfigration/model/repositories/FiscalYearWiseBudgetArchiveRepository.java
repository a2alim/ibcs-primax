package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudget;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudgetArchive;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

@Repository
public interface FiscalYearWiseBudgetArchiveRepository extends ServiceRepository<FiscalYearWiseBudgetArchive> {



}
