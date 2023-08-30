package com.ibcs.idsdp.projectconcept.approval_process_flow.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.projectconcept.approval_process_flow.web.dto.request.ProjectMovementStageRequest;

import java.util.List;

public interface ProjectMovementService {
  public void saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest);

  ProjectMovementStage getCurrentStageInDpp(Long dppMasterId);

  ProjectMovementStage getCurrentStageInTapp(Long dppMasterId);

  ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId);

  List<ProjectMovementStage> setMovementDateBatchProcess();
}
