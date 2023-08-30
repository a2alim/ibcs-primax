package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectDetailsPartBRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.ProjectDetailsPartBResponse;

public interface ProjectDetailsPartBService {
    public ProjectDetailsPartBResponse saveProjectDetailsPartB(ProjectDetailsPartBRequest projectDetailsPartBRequest);

    public ProjectDetailsPartBResponse getProjectDetailsPartB(String uuid);

    public ProjectDetailsPartB getProjectDetailsByProjectId(String projectId);

    public ProjectDetailsPartBResponse updateProjectDetails(ProjectDetailsPartBRequest partBRequest, String id);
}
