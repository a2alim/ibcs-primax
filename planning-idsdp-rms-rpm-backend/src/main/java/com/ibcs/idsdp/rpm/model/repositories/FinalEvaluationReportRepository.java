package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.FinalEvaluationReport;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import javax.persistence.QueryHint;
import java.util.List;

@Repository
public interface FinalEvaluationReportRepository extends ServiceRepository<FinalEvaluationReport> {

    @QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
    List<FinalEvaluationReport> findAllByIsDeletedAndIsActive(boolean isDeleted, boolean isActive);

}
