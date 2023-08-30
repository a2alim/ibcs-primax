package com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.constants.ProjectMovementStageConstants;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.ProjectMovementAttachmentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectMovementStageConstants.PROJECT_MOVEMENT_STAGE_ATTACHMENT)
public class ProjectMovementAttachmentController {

    ProjectMovementAttachmentService projectMovementAttachmentService;

    @GetMapping("/attachment/{project-movement-stage-id}")
    public ProjectMovementAttachment getProjectMovementAttachment(@PathVariable("project-movement-stage-id") Long projectMovementStageId){
        return projectMovementAttachmentService.getProjectMovementAttachmentByProjectMovementId(projectMovementStageId);
    }
}
