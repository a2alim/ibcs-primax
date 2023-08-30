package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.request.PpsCodeEpimsCodeDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;

import java.util.List;

public interface ProjectInfoService {
    ProjectInfoResultDTO getProjectInfoByProjectCode(String projectCode);

    List<ProjectListResponseDTO> getApprovedDppTapp();

    List<ProjectListDTO> getNonApprovedDppTapp();

    ProjectInfoDetailDTO getProjectInfoDetailByPpsCode(String ppsCode);

    PimsProjectDetailInfoResultDTO getFullInfoByProjectCode(String projectCode);

    ResponseStatusDTO ePimsApprovalProjectAcknowledgement(PpsCodeEpimsCodeDTO projectDTO);
}
