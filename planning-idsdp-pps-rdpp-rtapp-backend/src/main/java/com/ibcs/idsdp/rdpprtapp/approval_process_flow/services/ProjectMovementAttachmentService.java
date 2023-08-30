package com.ibcs.idsdp.rdpprtapp.approval_process_flow.services;

import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementAttachment;

public interface ProjectMovementAttachmentService {
    ProjectMovementAttachment getProjectMovementAttachmentByProjectMovementId(Long projectMovementId);
}
