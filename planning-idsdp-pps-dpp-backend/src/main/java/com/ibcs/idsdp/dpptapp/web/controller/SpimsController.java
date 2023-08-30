package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.SpimsConstant;
import com.ibcs.idsdp.dpptapp.services.SpimsService;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectListResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.SpimsProjectDetailInfoResultDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(SpimsConstant.SPIMS_ENDPOINT)
public class SpimsController {

    private final SpimsService spimsService;

    @GetMapping(SpimsConstant.GET_PROJECT_LIST)
    public List<ProjectListResponseDTO> getMinistryDppTapp(){
        return spimsService.getMinistryDppTapp();
    }

    @GetMapping(SpimsConstant.GET_PROJECT_FULL_INFO + "/{project_code}")
    public SpimsProjectDetailInfoResultDTO getFullInfoByProjectCode(@PathVariable("project_code") @NotNull String projectCode){
        return spimsService.getFullInfoByProjectCode(projectCode);
    }

}
