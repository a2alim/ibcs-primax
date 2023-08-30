package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.AmsGreenPageConstant;
import com.ibcs.idsdp.dpptapp.services.AmsGreenPageService;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsGreenPageDTO;
import com.ibcs.idsdp.dpptapp.web.dto.amsDTO.AmsUnapprovedProjectResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.AmsProjectDetailInfoResultDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(AmsGreenPageConstant.AMS_ENDPOINT)
public class AmsGreenPageController {

    private final AmsGreenPageService amsGreenPageService;

    @GetMapping(AmsGreenPageConstant.GET_GREEN_PAGE_LIST + "/{ministryCode}" + "/{agencyCode}" + "/{financialYear}" + "/{programType}")
    public List<AmsGreenPageDTO> getGreenPageList(@PathVariable("ministryCode") String ministryCode, @PathVariable("agencyCode") String agencyCode,
                                                  @PathVariable("financialYear") String financialYear, @PathVariable("programType") Long programType) {
        return amsGreenPageService.getGreenPageList(ministryCode, agencyCode, financialYear, programType);
    }

    @GetMapping(AmsGreenPageConstant.GET_PROJECT_FULL_INFO_BY_PPS_ID + "/{pps_id}")
    public AmsProjectDetailInfoResultDTO getFullProjectInfoByPpsId(@PathVariable("pps_id") @NotNull Long ppsId){
        return amsGreenPageService.getFullProjectInfoByPpsId(ppsId);
    }

    @PostMapping(AmsGreenPageConstant.SEND_PROJECT_TO_AMS_BY_PPS_ID + "/{pps_id}")
    public AmsUnapprovedProjectResponseDTO sendProjectToAmsByPpsId(@PathVariable("pps_id") @NotNull Long ppsId){
        return amsGreenPageService.sendProjectToAmsByPpsId(ppsId);
    }
}
