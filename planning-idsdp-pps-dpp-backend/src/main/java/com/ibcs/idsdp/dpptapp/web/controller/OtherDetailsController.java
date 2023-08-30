package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.DppOtherDetails;
import com.ibcs.idsdp.dpptapp.services.DppOtherDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppOtherDetailsRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details-partb")
public class OtherDetailsController {

    DppOtherDetailsService dppOtherDetailsService;

    // For Create Oeher Details
    @PostMapping("/create-other-details")
    public ResponseEntity<?> createEffectImpact(@RequestBody DppOtherDetailsRequest dppOtherDetailsRequest) {
        Boolean success = dppOtherDetailsService.saveDppOtherDetails(dppOtherDetailsRequest);
        if (success)
            return new ResponseEntity<>(HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // For get Other Details by Project id
    @GetMapping("/getOtherDetails/{projectId}")
    public DppOtherDetails getOtherDetailsByProjectId(@PathVariable("projectId") String uuid) {
        System.out.println("controller hitted..................................");
        return dppOtherDetailsService.getOtherDetailsByProjectId(uuid);

    }

    // For update Other Details by Object and project id
    @PutMapping("/updateOtherDetails/{id}")
    public void updateProjectDetails(@RequestBody DppOtherDetailsRequest dppOtherDetailsRequest, @PathVariable String id) {
        System.out.println("controller...............");
        dppOtherDetailsService.updateOtherDetails(dppOtherDetailsRequest, id);
    }
}
