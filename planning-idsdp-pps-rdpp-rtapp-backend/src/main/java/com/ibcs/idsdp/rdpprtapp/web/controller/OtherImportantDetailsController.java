package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppOtherImportantDetails;
import com.ibcs.idsdp.rdpprtapp.services.DppOtherImportantDetailsService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppOtherImportantDetailsRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RequestMapping("/project-details-partb")
@RestApiController
public class OtherImportantDetailsController {

    private DppOtherImportantDetailsService dppOtherImportantDetailsService;

    // For Create Other Important Details
    @PostMapping("/create-other-important-details")
    public ResponseEntity<?> createEffectImpact(@RequestBody DppOtherImportantDetailsRequest dppOtherImportantDetailsRequest) {
        Boolean success = dppOtherImportantDetailsService.saveOtherImportantDetails(dppOtherImportantDetailsRequest);
        if (success)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // For get Other Important Details by Project id
    @GetMapping("/getOtherImportantDetails/{projectId}")
    public DppOtherImportantDetails getOtherImportantDetailsByProjectId(@PathVariable("projectId") String uuid) {
        System.out.println("controller hitted..................................");
        return dppOtherImportantDetailsService.getOtherImportantDetailsByProjectId(uuid);

    }

    // For update Other Important Details byu object and project Id
    @PutMapping("/updateOtherImportantDetails/{id}")
    public void updateOtherImportantDetails(@RequestBody DppOtherImportantDetailsRequest dppOtherImportantDetailsRequest, @PathVariable String id) {
        System.out.println("controller...............");
        dppOtherImportantDetailsService.updateOtherImportantDetails(dppOtherImportantDetailsRequest, id);
    }
}
