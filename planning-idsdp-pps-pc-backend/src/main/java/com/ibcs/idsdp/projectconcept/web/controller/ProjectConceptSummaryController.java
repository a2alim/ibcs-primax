package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.ProjectConceptSummaryConstant;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptSummary;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptSummaryService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptSummaryDTO;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ProjectConceptSummaryConstant.PROJECT_CONCEPT_SUMMARY)
public class ProjectConceptSummaryController extends BaseController<ProjectConceptSummary, ProjectConceptSummaryDTO> {

    private final ProjectConceptSummaryService projectConceptSummaryService;

    public ProjectConceptSummaryController(BaseService<ProjectConceptSummary, ProjectConceptSummaryDTO> baseService, ProjectConceptSummaryService projectConceptSummaryService) {
        super(baseService);
        this.projectConceptSummaryService = projectConceptSummaryService;
    }

}