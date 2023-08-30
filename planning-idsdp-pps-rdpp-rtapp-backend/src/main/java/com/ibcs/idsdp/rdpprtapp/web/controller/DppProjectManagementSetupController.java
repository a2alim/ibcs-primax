package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppProjectManagementSetupConstant;
import com.ibcs.idsdp.rdpprtapp.services.DppProjectManagementSetupService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppProjectManagementSetupDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseWithResults getPMSetup(@PathVariable String id) {
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
