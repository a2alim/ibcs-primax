package com.ibcs.idsdp.projectconcept.approval_process_flow.web.controller;


import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.approval_process_flow.constants.ProjectMovementStageConstants;
import com.ibcs.idsdp.projectconcept.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.projectconcept.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.projectconcept.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectMovementStageConstants.PROJECT_MOVEMENT_STAGE)
public class ProjectMovementController {

    ProjectMovementService projectMovementService;

    @PostMapping(ProjectMovementStageConstants.SAVE_MOVEMENT)
    public ResponseWithResults movement(@RequestBody ProjectMovementStageRequest projectMovementStageRequest){
        projectMovementService.saveNewMovement(projectMovementStageRequest);
        return new ResponseWithResults(200,"Saved Successfully", null);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_DPP+"/{dppMasterId}")
    public ResponseWithResults getCurrentProjectStageInDpp(@PathVariable("dppMasterId") Long dppMasterId){
        ProjectMovementStage projectMovementStage =  projectMovementService.getCurrentStageInDpp(dppMasterId);
        return new ResponseWithResults(200,"Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_TAPP+"/{tappMasterId}")
    public ResponseWithResults getCurrentProjectStageInTapp(@PathVariable("tappMasterId") Long tappMasterId){
        ProjectMovementStage projectMovementStage =  projectMovementService.getCurrentStageInTapp(tappMasterId);
        return new ResponseWithResults(200,"Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.GET_CURRENT_STAGE_IN_PC+"/{pcMasterId}")
    public ResponseWithResults getCurrentProjectStageInPc(@PathVariable("pcMasterId") Long pcMasterId){
        ProjectMovementStage projectMovementStage =  projectMovementService.getCurrentStageInProjectConcept(pcMasterId);
        return new ResponseWithResults(200,"Data Found", projectMovementStage);
    }

    @GetMapping(ProjectMovementStageConstants.SET_MOVEMENT_DATE_BATCH_PROCESS)
    public List<ProjectMovementStage> setMovementDateBatchProcess(){
        return projectMovementService.setMovementDateBatchProcess();
    }
}

