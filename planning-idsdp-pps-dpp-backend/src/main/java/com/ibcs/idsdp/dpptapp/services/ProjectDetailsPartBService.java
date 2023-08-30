package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectDetailsPartBRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectDetailsPartBResponse;

public interface ProjectDetailsPartBService {
    public ProjectDetailsPartBResponse saveProjectDetailsPartB(ProjectDetailsPartBRequest projectDetailsPartBRequest);

    public ProjectDetailsPartBResponse getProjectDetailsPartB(String uuid);

    public ProjectDetailsPartB getProjectDetailsByProjectId(String projectId);

    public ProjectDetailsPartBResponse updateProjectDetails(ProjectDetailsPartBRequest partBRequest, String id);
}
