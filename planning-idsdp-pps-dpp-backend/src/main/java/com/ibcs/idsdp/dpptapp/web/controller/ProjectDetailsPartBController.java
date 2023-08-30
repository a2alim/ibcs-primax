package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.services.ProjectDetailsPartBService;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectDetailsPartBRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectDetailsPartBResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
public class ProjectDetailsPartBController {

    ProjectDetailsPartBService projectDetailsPartBService;

    // For Create Project Details Part B
    @PostMapping("/create-project-details-partb")
    public ResponseEntity<?> createProjectDetailsPartB(@RequestBody ProjectDetailsPartBRequest projectDetailsPartBRequest) {
        ProjectDetailsPartBResponse projectDetailsPartBResponse = projectDetailsPartBService.saveProjectDetailsPartB(projectDetailsPartBRequest);
        if (projectDetailsPartBResponse != null)
            return new ResponseEntity<>(projectDetailsPartBResponse, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // For Get Project Details Part B By Uuid
    @GetMapping("/get-project-details/{uuId}")
    public ResponseEntity<ProjectDetailsPartBResponse> getProjectDetails(@PathVariable("uuId") String uuid) {
        ProjectDetailsPartBResponse projectDetailsPartBResponse = projectDetailsPartBService.getProjectDetailsPartB(uuid);
        return new ResponseEntity<ProjectDetailsPartBResponse>(projectDetailsPartBResponse, HttpStatus.OK);
    }

    // For Get Project Details Part B By Project Id
    @GetMapping("/getProjctDetails/{projectId}")
    public ProjectDetailsPartB getProjectDetailsByProjectId(@PathVariable("projectId") String uuid) {
        return projectDetailsPartBService.getProjectDetailsByProjectId(uuid);

    }

    // For update Project Details Parb B
    @PutMapping("/updateProjectDetails/{id}")
    public void updateProjectDetails(@RequestBody ProjectDetailsPartBRequest partBRequest, @PathVariable String id) {
        System.out.println("controller...............");
        projectDetailsPartBService.updateProjectDetails(partBRequest, id);
    }
}
