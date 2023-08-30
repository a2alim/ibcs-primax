package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.ProjectInfoServiceImplConstant;
import com.ibcs.idsdp.dpptapp.services.ProjectInfoService;
import com.ibcs.idsdp.dpptapp.web.dto.request.PpsCodeEpimsCodeDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectInfoServiceImplConstant.PROJECT_INFO_ENDPOINT)
public class ProjectInfoController {

    private final ProjectInfoService projectInfoService;

    @GetMapping("/project/{project_code}")
    public ProjectInfoResultDTO getByProjectCode(@PathVariable("project_code") @NotNull String projectCode){
        return projectInfoService.getProjectInfoByProjectCode(projectCode);
    }

    @GetMapping("/get-approved-list")
    public List<ProjectListResponseDTO> getApprovedDppTapp(){
        return projectInfoService.getApprovedDppTapp();
    }

    @GetMapping("/get-non-approved-list")
    public List<ProjectListDTO> getNonApprovedDppTapp(){
        return projectInfoService.getNonApprovedDppTapp();
    }

    @GetMapping("/get-project-info-detail-by-pps-code/{ppsCode}")
    public ProjectInfoDetailDTO getProjectInfoDetailByPpsCode(@PathVariable("ppsCode") @NotNull String ppsCode){
        return projectInfoService.getProjectInfoDetailByPpsCode(ppsCode);
    }

    @GetMapping("/full-info/{project_code}")
    public PimsProjectDetailInfoResultDTO getFullInfoByProjectCode(@PathVariable("project_code") @NotNull String projectCode){
        return projectInfoService.getFullInfoByProjectCode(projectCode);
    }

    @PostMapping(path = "/approval-project-acknowledgement", produces = "application/json")
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(@RequestBody PpsCodeEpimsCodeDTO projectDTO) {
        return projectInfoService.ePimsApprovalProjectAcknowledgement(projectDTO);
    }
}
