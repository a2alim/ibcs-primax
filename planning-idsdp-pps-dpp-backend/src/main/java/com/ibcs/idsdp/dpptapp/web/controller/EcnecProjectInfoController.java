package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.EcnecProjectInfoConstant;
import com.ibcs.idsdp.dpptapp.services.EcnecProjectInfoService;
import com.ibcs.idsdp.dpptapp.web.dto.ecnecDTO.EcnecProjectInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(EcnecProjectInfoConstant.ECNEC_PROJECT_INFO_ENDPOINT)
public class EcnecProjectInfoController {

    private final EcnecProjectInfoService ecnecProjectInfoService;

    @GetMapping(EcnecProjectInfoConstant.GET_APPROVED_PROJECT)
    public List<ProjectListResponseDTO> getApprovedDppTapp(){
        return ecnecProjectInfoService.getApprovedDppTapp();
    }

    @GetMapping(EcnecProjectInfoConstant.GET_PROJECT_INFO_BY_PROJECT_CODE+"/{project_code}/{project_type}")
    public EcnecProjectInfoDTO getProjectInfoByProjectCode(@PathVariable("project_code") @NotNull String projectCode, @PathVariable("project_type") @NotNull String projectType) {
        return ecnecProjectInfoService.getProjectInfoByProjectCode(projectCode, projectType);
    }

    @PostMapping(path = EcnecProjectInfoConstant.APPROVAL_PROJECT_ACKNOWLEDGEMENT, produces = "application/json")
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(@RequestBody ProjectListDTO projectDTO) {
        return ecnecProjectInfoService.ecnecApprovalProjectAcknowledgement(projectDTO);
    }

    @GetMapping(path = EcnecProjectInfoConstant.GET_REVISED_APPROVED_PROJECT, produces = "application/json")
    public List<ProjectListResponseDTO> getApprovedRdppRtapp() {
        return ecnecProjectInfoService.getApprovedRdppRtapp();
    }
}
