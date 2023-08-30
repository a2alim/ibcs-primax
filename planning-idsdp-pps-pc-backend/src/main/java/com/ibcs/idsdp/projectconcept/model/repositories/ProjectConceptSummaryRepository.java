package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptSummary;

import java.util.List;

public interface ProjectConceptSummaryRepository extends ServiceRepository<ProjectConceptSummary> {

    ProjectConceptSummary findByProjectConceptMasterIdAndIsDeleted(Long projectConceptMaster, Boolean isDeleted);

    List<ProjectConceptSummary> findByProjectConceptMasterIdInAndIsFeasibilityRequired(List<Long> ids, Boolean isFsRequiredo);
}
