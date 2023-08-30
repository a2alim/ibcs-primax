package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ProjectTypeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectType;
import com.ibcs.idsdp.idsdpconfigration.services.ProjectTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectTypeDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(ProjectTypeConstant.projectType)
public class ProjectTypeController extends BaseController<ProjectType, ProjectTypeDTO> {

    private final ProjectTypeService projectTypeService;

    public ProjectTypeController(BaseService<ProjectType, ProjectTypeDTO> baseService, ProjectTypeService projectTypeService) {
        super(baseService);
        this.projectTypeService = projectTypeService;
    }

    /**
     * for get Active JustificationType
     * @return
     */
    @GetMapping(path = ProjectTypeConstant.GET_ACTIVE_PROJECT_TYPE, produces = "application/json")
    public List<ProjectTypeDTO> getActiveJustificationType() {
        return projectTypeService.getActiveProjectType();
    }

    @GetMapping(path = ProjectTypeConstant.GET_BY_NAME_EN + "/{nameEn}", produces = "application/json")
    public ProjectTypeDTO getByNameEn(@PathVariable String nameEn) {
        return projectTypeService.getByNameEn(nameEn);
    }

}
