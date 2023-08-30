package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.ProjectInfoServiceConstant;
import com.ibcs.idsdp.projectconcept.services.ProjectInfoService;
import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountRequestDTO;
import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectInfoServiceConstant.PROJECT_INFO_ENDPOINT)
public class ProjectInfoController {

    private final ProjectInfoService projectInfoService;

    @PostMapping(ProjectInfoServiceConstant.GET_PROJECT_COUNT)
    public List<GisProjectCountResponseDTO> getProjectCountByDivisionAndZilla(@RequestBody GisProjectCountRequestDTO request) {
        return projectInfoService.getProjectCountByDivisionAndZilla(request);
    }
}
