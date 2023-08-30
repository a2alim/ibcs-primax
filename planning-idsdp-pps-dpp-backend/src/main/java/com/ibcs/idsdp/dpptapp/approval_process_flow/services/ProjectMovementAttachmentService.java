package com.ibcs.idsdp.dpptapp.approval_process_flow.services;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProjectMovementAttachmentService {
    ProjectMovementAttachment getProjectMovementAttachmentByProjectMovementId(Long projectMovementId);

    Page<Attachment> getAttachmentById(Long id, PageableRequestBodyDTO requestBodyDTO);

    List<ProjectMovementAttachment> getAllProjectMovementAttachmentById(Long projectMovementId);

    Page<ProjectMovementAttachment> getProjectMovementAttachmentById(Long id, PageableRequestBodyDTO requestBodyDTO);
}
