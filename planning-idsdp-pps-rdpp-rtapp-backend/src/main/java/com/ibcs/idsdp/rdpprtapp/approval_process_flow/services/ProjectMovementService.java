package com.ibcs.idsdp.rdpprtapp.approval_process_flow.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectMovementService {
    ProjectMovementStage saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest);

    ProjectMovementStage getCurrentStageInDpp(Long dppMasterId);

    ProjectMovementStage getCurrentStageInTapp(Long dppMasterId);

    ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId);

    List<ProjectMovementStage> getAllStageByUserId(Long userId);

    ProjectMovementStage getProjectMovementStage(Long id);

    ResponseWithResults saveProjectMovementAttachment(MultipartFile multipartFile, ProjectMovementStage projectMovementStage);

    List<ProjectMovementStage> getMinistryApprovedProjectConceptList();

    List<ProjectMovementStageResponse> getAllStageByMasterId(String source, Long masterId);

}
