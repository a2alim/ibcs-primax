package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.response.ProjectConceptLocationResponse;

public interface ProjectConceptLocationService {

    ProjectConceptLocationResponse getByProjectSummaryId(Long projectSummaryId);

}
