package com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories;

import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMovementAttachmentRepository extends JpaRepository<ProjectMovementAttachment, Long> {

    ProjectMovementAttachment findByProjectMovementStageIdAndPaperTypeIsNull(Long projectMovementStageId);

    List<ProjectMovementAttachment> findByProjectMovementStageIdAndPaperTypeIsNotNull(Long projectMovementStageId);

    List<ProjectMovementAttachment> findByProjectMovementStageIdAndAndPaperType(Long projectMovementStageId, String paperType);

    Page<ProjectMovementAttachment> findByProjectMovementStageIdInOrderByIdDesc(List<Long> projectMovementStageIds, Pageable pageable);

    List<ProjectMovementAttachment> findAllByProjectMovementStageIdInOrderByIdDesc(List<Long> projectMovementStageIds);
}
