package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.SpimsProjectDetailInfoResultDTO;

import java.util.List;

public interface SpimsService {

    List<ProjectListResponseDTO> getMinistryDppTapp();

    SpimsProjectDetailInfoResultDTO getFullInfoByProjectCode(String projectCode);
}
