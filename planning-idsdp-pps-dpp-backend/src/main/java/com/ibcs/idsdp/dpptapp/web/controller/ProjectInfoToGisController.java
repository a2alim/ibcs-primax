package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.ProjectInfoToGisServiceImplConstant;
import com.ibcs.idsdp.dpptapp.services.ProjectInfoToGisService;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectInfoToGisRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@AllArgsConstructor
@RestApiController
@RequestMapping(ProjectInfoToGisServiceImplConstant.PROJECT_INFO_TO_GIS_ENDPOINT)
public class ProjectInfoToGisController {

    private final ProjectInfoToGisService projectInfoToGisService;

    @PostMapping(ProjectInfoToGisServiceImplConstant.SEND_PROJECT_INFO_TO_GIS)
    public ResponseStatus getByProjectConceptIdAndComponentName(@RequestBody ProjectInfoToGisRequestDTO request) {
        return projectInfoToGisService.getProjectInfoToGisByIdAndType(request);
    }
}
