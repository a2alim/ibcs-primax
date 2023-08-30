package com.ibcs.idsdp.dpptapp.web.controller.projectSummariesController;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.constants.ProjectSummariesConstant;
import com.ibcs.idsdp.dpptapp.services.projectSummariesService.ProjectSummariesService;
import com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto.ProjectSummariesDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping(ProjectSummariesConstant.PROJECT_SUMMARIES_CONSTANT)
public class ProjectSummariesController {
    private final ProjectSummariesService service;

    @PostMapping(value = ProjectSummariesConstant.CREATE_PROJECT_SUMMARIES_CONSTANT, produces = "application/json")
    public ProjectSummariesDto createProjectSummaries(@RequestBody ProjectSummariesDto request){
        return service.createProjectSummaries(request);
    }
    @PutMapping(value = ProjectSummariesConstant.UPDATE_PROJECT_SUMMARIES_CONSTANT, produces = "application/json")
    public ProjectSummariesDto updateProjectSummaries(@RequestBody ProjectSummariesDto request, @PathVariable String projectUuid, @PathVariable String summariesType){
        return service.updateProjectSummaries(request, projectUuid, summariesType);
    }


    @GetMapping(ProjectSummariesConstant.GET_PROJECT_SUMMARIES_CONSTANT)
    public ResponseWithResults getProjectSummaries(@PathVariable String projectUuid, @PathVariable String summariesType){
        return service.getProjectSummaries(projectUuid, summariesType);
    }

}
