package com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.constants.ProjectMovementStageConstants;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
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

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_RDPP + "/{rdppMasterId}")
    public ResponseWithResults getCurrentProjectStageInDpp(@PathVariable("rdppMasterId") Long rdppMasterId) {
        ProjectMovementStage projectMovementStage = projectMovementService.getCurrentStageInDpp(rdppMasterId);
        return new ResponseWithResults(200, "Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_RTAPP + "/{tappMasterId}")
    public ResponseWithResults getCurrentProjectStageInTapp(@PathVariable("tappMasterId") Long tappMasterId) {
        ProjectMovementStage projectMovementStage = projectMovementService.getCurrentStageInTapp(tappMasterId);
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
       return projectMovementService.saveProjectMovementAttachment(attachmentFile, projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_MINISTRY_APPROVED_PROJECT_CONCEPT_IDS)
    public ResponseWithResults getMinistryApprovedProjectConceptList(){
        List<ProjectMovementStage> projectMovementStageList = projectMovementService.getMinistryApprovedProjectConceptList();
        return new ResponseWithResults(200, "Data Found", projectMovementStageList.stream().map(ProjectMovementStage::getProjectConceptMasterId));
    }

}
