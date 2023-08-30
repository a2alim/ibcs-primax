package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsGreenPageDTO;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsUnapprovedProjectResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.AmsProjectDetailInfoResultDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.AmsUnapprovedProjectDetailInfoResultDTO;

import java.util.List;

public interface AmsGreenPageService {
    List<AmsGreenPageDTO> getGreenPageList(String ministryCode, String agencyCode, String financialYear, Long programType);

    AmsProjectDetailInfoResultDTO getFullProjectInfoByPpsId(Long ppsId);
    AmsUnapprovedProjectResponseDTO sendProjectToAmsByPpsId(Long ppsId);
}
