package com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.repositories;

import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMovementAttachmentRepository extends JpaRepository<ProjectMovementAttachment, Long> {
    ProjectMovementAttachment findByProjectMovementStageIdAndPaperTypeIsNull(Long projectMovementStageId);
}
