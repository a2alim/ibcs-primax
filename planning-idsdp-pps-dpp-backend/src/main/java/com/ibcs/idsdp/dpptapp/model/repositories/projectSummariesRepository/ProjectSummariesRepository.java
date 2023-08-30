package com.ibcs.idsdp.dpptapp.model.repositories.projectSummariesRepository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.dpptapp.model.domain.projectSummaries.ProjectSummaries;

import java.util.Optional;

public interface ProjectSummariesRepository  extends ServiceRepository<ProjectSummaries> {

    ProjectSummaries findByProjectUuidAndSummariesType(String projectUuid, String summariesType);
    Optional<ProjectSummaries> findByProjectUuidAndSummariesTypeAndIsDeleted(String projectUuid, String summariesType, boolean isDeleted);
}
