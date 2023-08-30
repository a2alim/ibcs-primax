package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.TappProjectDetails;
import com.ibcs.idsdp.dpptapp.services.TappProjectDetailsService;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappProjectDetailsRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details")

public class TappProjectDetailsController{
    private TappProjectDetailsService tappProjectDetailsService;

    /**
     * For create tapp project details records
     * @param tappProjectDetailsRequest
     * @return
     */
    @PostMapping(path = "/create", produces = "application/json")
    public ResponseStatus create(@RequestBody TappProjectDetailsRequest tappProjectDetailsRequest) {
        return tappProjectDetailsService.save(tappProjectDetailsRequest);
    }

    /**
     * For get tapp project details records
     * @return
     */
    @GetMapping("get-data")
    public TappProjectDetails getRowData(){
        return tappProjectDetailsService.getFirstRowData();
    }

    @GetMapping("getProjectDetails/{pcUuid}")
    public ResponseWithResults getProjectDetailsData(@PathVariable String pcUuid){
        return tappProjectDetailsService.getProjectDetailsData(pcUuid);
    }

    @PutMapping("update-data/{pcUuid}")
    public ResponseStatus updateProjectDetails(@RequestBody TappProjectDetailsRequest request,@PathVariable String pcUuid){
        return tappProjectDetailsService.updateProjectDetails(request, pcUuid);
    }
}
