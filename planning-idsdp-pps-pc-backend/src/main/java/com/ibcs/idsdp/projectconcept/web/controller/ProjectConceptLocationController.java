package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.ProjectConceptLocationConstant;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptLocation;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptLocationService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptLocationDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.ProjectConceptLocationResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ProjectConceptLocationConstant.PROJECT_LOCATION)
public class ProjectConceptLocationController extends BaseController<ProjectConceptLocation, ProjectConceptLocationDTO> {

    private final ProjectConceptLocationService service;

    public ProjectConceptLocationController(BaseService<ProjectConceptLocation, ProjectConceptLocationDTO> baseService, ProjectConceptLocationService service) {
        super(baseService);
        this.service = service;
    }


    // Getting by project summary id
    @GetMapping(path = ProjectConceptLocationConstant.GET_BY_PROJECT_SUMMARY_ID + "{projectSummaryId}" , produces = "application/json")
    public ProjectConceptLocationResponse getProjectSummaryByGoB(@PathVariable Long projectSummaryId) {
        return service.getByProjectSummaryId(projectSummaryId);
    }
}
