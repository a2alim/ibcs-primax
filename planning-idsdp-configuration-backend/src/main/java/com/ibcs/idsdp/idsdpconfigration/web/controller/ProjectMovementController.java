package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ProjectMovementConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectMovement;
import com.ibcs.idsdp.idsdpconfigration.services.ProjectMovementService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectMovementDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProjectMoveRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ProjectMovementConstant.projectMovement)
public class ProjectMovementController extends BaseController<ProjectMovement, ProjectMovementDTO> {

    private final ProjectMovementService projectMovementService;

    public ProjectMovementController(BaseService<ProjectMovement, ProjectMovementDTO> baseService, ProjectMovementService projectMovementService) {
        super(baseService);
        this.projectMovementService = projectMovementService;
    }

    /**
     * for get Active ProjectMovement
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = ProjectMovementConstant.GET_ACTIVE_PROJECT_MOVEMENT + "/{page}" + "/{size}", produces = "application/json")
    public Page<ProjectMovementDTO> getActiveProjectMovement(@PathVariable("page") int page, @PathVariable("size") int size) {
        return projectMovementService.getActiveProjectMovement(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    /**
     * for get ProjectMovement By OrderId
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = ProjectMovementConstant.GET_PROJECT_MOVEMENT_BY_ORDER_ID + "/{page}" + "/{size}", produces = "application/json")
    public Page<ProjectMovementDTO> getProjectMovementByOrderId(@PathVariable("page") int page, @PathVariable("size") int size) {
        return projectMovementService.getProjectMovementByOrderId(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }

    /**
     * for move Project
     * @param projectMoveRequest
     */
    @PostMapping(path = ProjectMovementConstant.MOVE_PROJECT, produces = "application/json")
    public void moveProject(@RequestBody ProjectMoveRequest projectMoveRequest) {
        projectMovementService.moveProject(projectMoveRequest);
    }

    /**
     * for get All ProjectMovement By OrderId And Module
     * @param moduleId
     * @return
     */
    @GetMapping(path = ProjectMovementConstant.ALL_PROJECT_MOVEMENT_BY_ORDER_ID_AND_MODULE + "/{moduleId}", produces = "application/json")
    public List<ProjectMovementDTO> getAllProjectMovementByOrderIdAndModule(@PathVariable("moduleId") Long moduleId) {
        return projectMovementService.getProjectMovementByOrderIdAndModule(moduleId);
    }

}
