package com.ibcs.idsdp.dpptapp.approval_process_flow.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.approval_process_flow.constants.ProjectMovementStageConstants;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.EcnecConditions;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.EcnecConditionsRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.MeetingPaperResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.RemainingTimeConditionResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.ApprovedDppTappResponseDto;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectMovementStageDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectMovementStageConstants.PROJECT_MOVEMENT_STAGE)
public class ProjectMovementController {

    ProjectMovementService projectMovementService;

    @PostMapping(ProjectMovementStageConstants.SAVE_MOVEMENT)
    public ResponseWithResults movement(@RequestBody ProjectMovementStageRequest projectMovementStageRequest) {
        ProjectMovementStage projectMovementStage = projectMovementService.saveNewMovement(projectMovementStageRequest);
        return new ResponseWithResults(200, "Saved Successfully", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_DPP + "/{dppMasterId}")
    public ResponseWithResults getCurrentProjectStageInDpp(@PathVariable("dppMasterId") Long dppMasterId) {
        ProjectMovementStageDTO projectMovementStage = projectMovementService.getCurrentStageDTOInDpp(dppMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_TAPP + "/{tappMasterId}")
    public ResponseWithResults getCurrentProjectStageInTapp(@PathVariable("tappMasterId") Long tappMasterId) {
        ProjectMovementStageDTO projectMovementStage = projectMovementService.getCurrentStageDTOInTapp(tappMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_PC + "/{pcMasterId}")
    public ResponseWithResults getCurrentProjectStageInPc(@PathVariable("pcMasterId") Long pcMasterId) {
        ProjectMovementStage projectMovementStage = projectMovementService.getCurrentStageInProjectConcept(pcMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_STAGE_BY_USER_ID + "/{userId}")
    public List<ProjectMovementStage> getAllStageByUserId(@PathVariable("userId") Long userId) {
        return projectMovementService.getAllStageByUserId(userId);
    }

    @GetMapping(ProjectMovementStageConstants.GET_All_STAGE_BY_MASTER_ID + "/{source}" + "/{masterId}")
    public List<ProjectMovementStageResponse> getAllStageByMasterId(@PathVariable("source") String source, @PathVariable("masterId") Long masterId) {
        return projectMovementService.getAllStageByMasterId(source, masterId);
    }

    @PostMapping(ProjectMovementStageConstants.SAVE_ATTACHMENT)
    public ResponseWithResults saveProjectMovementAttachment(@RequestParam("projectMovementStageId") Long projectMovementStageId, @RequestParam(value = "attachmentFile", required = true) MultipartFile attachmentFile){
       ProjectMovementStage projectMovementStage = projectMovementService.getProjectMovementStage(projectMovementStageId);
       return projectMovementService.saveProjectMovementAttachment(attachmentFile, projectMovementStage, null);
    }

    @GetMapping(ProjectMovementStageConstants.GET_MINISTRY_APPROVED_PROJECT_CONCEPT_IDS)
    public ResponseWithResults getMinistryApprovedProjectConceptList(){
        List<ProjectMovementStage> projectMovementStageList = projectMovementService.getMinistryApprovedProjectConceptList();
        return new ResponseWithResults(200, "Data Found", projectMovementStageList.stream().map(ProjectMovementStage::getProjectConceptMasterId));
    }


    @GetMapping(ProjectMovementStageConstants.GET_APPROVED_PROJECT_DPP_TAPP)
    public ResponseWithResults getMinistryApprovedDppTappProjectList() {
        List<ApprovedDppTappResponseDto> dppTappProjectList = projectMovementService.getMinistryApprovedDppTappProjectList();
        return new ResponseWithResults(200, "Data Found", dppTappProjectList);
    }

    @GetMapping(ProjectMovementStageConstants.GET_APPROVED_PROJECT_PROJECT_BY_AGENCY_ID + "/{agencyId}")
    public ResponseWithResults getApprovedProjectByAgencyId(@PathVariable("agencyId") Long agencyId) {
        List<ApprovedDppTappResponseDto> list = projectMovementService.getApprovedProjectByAgencyId(agencyId);
        return new ResponseWithResults(200, "Data Found", list);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_RDPP + "/{rdppMasterId}")
    public ResponseWithResults getCurrentProjectStageInRDpp(@PathVariable("rdppMasterId") Long rdppMasterId) {
        ProjectMovementStage projectMovementStage = projectMovementService.getCurrentStageInRDpp(rdppMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_RTAPP + "/{rtappMasterId}")
    public ResponseWithResults getCurrentProjectStageInRTapp(@PathVariable("rtappMasterId") Long rtappMasterId) {
        ProjectMovementStage projectMovementStage = projectMovementService.getCurrentStageInRTapp(rtappMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @PostMapping(ProjectMovementStageConstants.SAVE_PSC_WORKING_PAPER_ATTACHMENT)
    public ResponseWithResults savePscWorkingPaperAttachment(@RequestParam("projectMovementStageId") Long projectMovementStageId, @RequestParam(value = "attachmentFile", required = true) MultipartFile attachmentFile, @RequestParam(value = "paperType", required = true) String paperType){
        ProjectMovementStage projectMovementStage = projectMovementService.getProjectMovementStage(projectMovementStageId);
        return projectMovementService.saveProjectMovementAttachment(attachmentFile, projectMovementStage, paperType);
    }

    @GetMapping(ProjectMovementStageConstants.CHECK_ALL_MEETING_PAPER_ATTACHMENT + "/{projectMovementStageId}")
    public ResponseWithResults checkAllMeetingPaperAttachment(@PathVariable("projectMovementStageId") Long projectMovementStageId){
        MeetingPaperResponse upwardMoveStatus =  projectMovementService.checkAllMeetingPaperAttachment(projectMovementStageId);
        return new ResponseWithResults(200, "Data Found", upwardMoveStatus);
    }

    @PostMapping(value = ProjectMovementStageConstants.SAVE_CONDITIONAL_ECNEC_APPROVE)
    public ResponseWithResults saveCOnditionalEcnecApprove(@RequestParam("ecnecConditionsRequest") String ecnecConditionsRequest, @RequestParam(value = "attachmentFile", required = true) MultipartFile attachmentFile) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        EcnecConditionsRequest ecnecConditionsDto = objectMapper.readValue(ecnecConditionsRequest,EcnecConditionsRequest.class);
        EcnecConditions ecnecConditions = projectMovementService.saveEcnecConditions(ecnecConditionsDto, attachmentFile);
        return new ResponseWithResults(200, "Data Found", ecnecConditions);
    }

    @PostMapping(value = ProjectMovementStageConstants.GET_DPP_FORWARD_REMAINING_TIME)
    public ResponseWithResults getDppRemainingTimeCondition(@RequestBody ProjectMovementStageRequest projectMovementStageRequest) {
        RemainingTimeConditionResponse response = projectMovementService.getDppRemainingTimeCondition(projectMovementStageRequest);
        return new ResponseWithResults(200, "Data Found", response);
    }
}
