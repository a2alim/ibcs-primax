package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.ecnecDTO.EcnecProjectInfoDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;

import java.util.List;

public interface EcnecProjectInfoService {

    List<ProjectListResponseDTO> getApprovedDppTapp();

    EcnecProjectInfoDTO getProjectInfoByProjectCode(String projectCode, String projectType);

    ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO);

    List<ProjectListResponseDTO> getApprovedRdppRtapp();
}
