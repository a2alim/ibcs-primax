package com.ibcs.idsdp.dpptapp.approval_process_flow.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.EcnecConditions;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.EcnecConditionsRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.MeetingPaperResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.RemainingTimeConditionResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.ApprovedDppTappResponseDto;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectMovementStageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectMovementService {
    ProjectMovementStage saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest);

    ProjectMovementStage getCurrentStageInDpp(Long dppMasterId);

    ProjectMovementStageDTO getCurrentStageDTOInDpp(Long dppMasterId);

    ProjectMovementStage getCurrentStageInTapp(Long dppMasterId);

    ProjectMovementStageDTO getCurrentStageDTOInTapp(Long dppMasterId);

    ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId);

    List<ProjectMovementStage> getAllStageByUserId(Long userId);

    ProjectMovementStage getProjectMovementStage(Long id);

    ResponseWithResults saveProjectMovementAttachment(MultipartFile multipartFile, ProjectMovementStage projectMovementStage, String paperType);

    List<ProjectMovementStage> getMinistryApprovedProjectConceptList();

    List<ApprovedDppTappResponseDto> getMinistryApprovedDppTappProjectList();

    List<ApprovedDppTappResponseDto> getApprovedProjectByAgencyId(Long agencyId);

    List<ProjectMovementStageResponse> getAllStageByMasterId(String source, Long masterId);

    ProjectMovementStage getCurrentStageInRDpp(Long rdppMasterId);

    ProjectMovementStage getCurrentStageInRTapp(Long rtappMasterId);

    MeetingPaperResponse checkAllMeetingPaperAttachment(Long projectMovementStageId);

    EcnecConditions saveEcnecConditions(EcnecConditionsRequest ecnecConditionsRequest, MultipartFile multipartFile);

    RemainingTimeConditionResponse getDppRemainingTimeCondition(ProjectMovementStageRequest projectMovementStageRequest);
}
