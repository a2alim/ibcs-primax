package com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.impl;

import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories.ProjectMovementAttachmentRepository;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.ProjectMovementAttachmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ProjectMovementAttachmentServiceImpl implements ProjectMovementAttachmentService {

    ProjectMovementAttachmentRepository projectMovementAttachmentRepository;

    @Override
    public ProjectMovementAttachment getProjectMovementAttachmentByProjectMovementId(Long projectMovementId) {
        ProjectMovementAttachment projectMovementAttachment = projectMovementAttachmentRepository.findByProjectMovementStageIdAndPaperTypeIsNull(projectMovementId);
        return projectMovementAttachment;
    }
}
