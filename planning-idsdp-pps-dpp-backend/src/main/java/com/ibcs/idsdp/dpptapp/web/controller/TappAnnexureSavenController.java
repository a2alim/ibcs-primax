package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureSaven;
import com.ibcs.idsdp.dpptapp.services.TappAnnexureSavenService;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureSavenDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureSavenRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestApiController
@RequestMapping("/tapp-annexure-seven")

public class TappAnnexureSavenController {

    private TappAnnexureSavenService tappAnnexureSavenService;

    /**
     * For create tapp annexure vii records
     * @param tppAnnexureSavenRequest
     * @return
     */
    @PostMapping(path = "/create", produces = "application/json")
    public TppAnnexureSavenDTO create(@RequestBody TppAnnexureSavenRequest tppAnnexureSavenRequest) {
        return tappAnnexureSavenService.save(tppAnnexureSavenRequest);
    }

    /**
     * For get tapp annexure vii records
     * @return
     */
/*    @GetMapping("get-data")
    public TppAnnexureSaven getRowData(){
        return tappAnnexureSavenService.getFirstRowData();
    }*/


    @GetMapping(path = "get-data" + "/{proConcept_uuid}" , produces = "application/json")
    public ResponseWithResults getFirstRowData(@PathVariable String proConcept_uuid) {
        return tappAnnexureSavenService.getFirstRowData(proConcept_uuid);
    }
}
