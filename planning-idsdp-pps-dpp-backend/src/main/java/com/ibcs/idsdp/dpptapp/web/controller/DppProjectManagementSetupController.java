package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppProjectManagementSetupConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagementSetup;
import com.ibcs.idsdp.dpptapp.services.DppProjectManagementSetupService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppProjectManagementSetupDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping(DppProjectManagementSetupConstant.dppProjectManagementSetup)
public class DppProjectManagementSetupController {

    private final DppProjectManagementSetupService projectManagementSetupService;


    /**
     * For create
     * @param listOfObject
     * @return
     */
    @PostMapping(path = "create-project-setup", consumes = "application/json", produces = "application/json")
    public DppProjectManagementSetupDto saveProject(@RequestBody DppProjectManagementSetupDto listOfObject){
        System.out.println("save success");
        return projectManagementSetupService.createProjectSetup(listOfObject);
    }

    /**
     * Get Project Management Setup
     * @param id
     * @return
     */
    @GetMapping("getProjectManagementSetup/{id}")
    public ResponseWithResults getPMSetup(@PathVariable String id) throws IOException {
        System.out.println("get Data");
        return projectManagementSetupService.getProjectSetupListByProject(id);
    }

    /**
     * For Update
     * @param projectManagementSetupDto
     * @return
     */
    @PutMapping("update")
    public DppProjectManagementSetupDto update(@RequestBody DppProjectManagementSetupDto projectManagementSetupDto) {
        System.out.println("hit controller");
        return projectManagementSetupService.updateProjectSetup(projectManagementSetupDto);
    }

    /**
     * For Delete
     * @param uuid
     * @return
     */
    @DeleteMapping("/deleteRow3/{uuid}")
    public String deleteLinkageAndTarget(@PathVariable String uuid) {
        return projectManagementSetupService.deleteProjectSetup(uuid);
    }

    @DeleteMapping("/deleteRow/{uuid}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable String uuid){
        return projectManagementSetupService.deleteRow(uuid);
    }

    /**
     * Get Project Management Setup Attachment
     * @param id
     * @return
     */
    @GetMapping("getProjectMannagementOrganogramAttachment/{id}")
    public ResponseWithResults getProjectMannagementOrganogramAttachment(@PathVariable String id) {
        return projectManagementSetupService.getProjectMannagementOrganogramAttachment(id);
    }
}
