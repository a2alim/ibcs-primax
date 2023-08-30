package com.ibcs.idsdp.projectconcept.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptLocation;

public interface ProjectConceptLocationRepository extends ServiceRepository<ProjectConceptLocation> {

    ProjectConceptLocation findByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDeleted);

    boolean existsByProjectConceptMasterIdAndIsDeleted(Long projectSummaryId, Boolean isDeleted);

}
