package com.ibcs.idsdp.feasibilitystudy.approval_process_flow.services;

import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.web.dto.request.ProjectMovementStageRequest;

public interface ProjectMovementService {
  public void saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest);

  ProjectMovementStage getCurrentStageInDpp(Long dppMasterId);

  ProjectMovementStage getCurrentStageInTapp(Long dppMasterId);

  ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId);

  ProjectMovementStage getCurrentStageInFsProposal(Long fsMasterId);
}
