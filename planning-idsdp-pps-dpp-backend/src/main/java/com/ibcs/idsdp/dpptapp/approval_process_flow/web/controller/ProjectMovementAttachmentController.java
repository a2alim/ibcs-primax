package com.ibcs.idsdp.dpptapp.approval_process_flow.web.controller;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.approval_process_flow.constants.ProjectMovementStageConstants;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementAttachmentService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectMovementStageConstants.PROJECT_MOVEMENT_STAGE_ATTACHMENT)
public class ProjectMovementAttachmentController {

    ProjectMovementAttachmentService projectMovementAttachmentService;

    @GetMapping("/attachment/{project-movement-stage-id}")
    public ProjectMovementAttachment getProjectMovementAttachment(@PathVariable("project-movement-stage-id") Long projectMovementStageId) {
        return projectMovementAttachmentService.getProjectMovementAttachmentByProjectMovementId(projectMovementStageId);
    }

    @GetMapping("/attachment/get-by-id/{id}/{page}/{size}")
    public Page<Attachment> getProjectMovementAttachmentById(@PathVariable("id") Long id, @PathVariable("page") int page, @PathVariable("size") int size) {
        return projectMovementAttachmentService.getAttachmentById(id,new PageableRequestBodyDTO() {{setPage(page); setSize(size);}});
    }

    @GetMapping("/attachment/get-all-by-id/{projectMovementId}")
    public List<ProjectMovementAttachment> getAllProjectMovementAttachmentById(@PathVariable("projectMovementId") Long projectMovementId) {
        return projectMovementAttachmentService.getAllProjectMovementAttachmentById(projectMovementId);
    }

    @GetMapping("/attachment/get-movement-attachment-by-id/{id}/{page}/{size}")
    public Page<ProjectMovementAttachment> getMovementAttachmentById(@PathVariable("id") Long id, @PathVariable("page") int page, @PathVariable("size") int size) {
        return projectMovementAttachmentService.getProjectMovementAttachmentById(id,new PageableRequestBodyDTO() {{setPage(page); setSize(size);}});
    }
}
