package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.ProjectLocationConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ProjectLocation;
import com.ibcs.idsdp.feasibilitystudy.services.ProjectLocationService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ProjectLocationDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.response.ProjectLocationResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ProjectLocationConstant.PROJECT_LOCATION)
public class ProjectLocationController extends BaseController<ProjectLocation, ProjectLocationDTO> {

    private final ProjectLocationService service;

    public ProjectLocationController(BaseService<ProjectLocation, ProjectLocationDTO> baseService, ProjectLocationService service) {
        super(baseService);
        this.service = service;
    }

    @GetMapping(path = ProjectLocationConstant.GET_BY_PROJECT_CONCEPT_ID + "/{fsrMasterId}" + "/{pcMasterId}", produces = "application/json")
    public ProjectLocationResponse getProjectConceptByGoB(@PathVariable Long fsrMasterId, @PathVariable Long pcMasterId) {
        return service.getByProjectConceptId(fsrMasterId,pcMasterId);
    }

}
