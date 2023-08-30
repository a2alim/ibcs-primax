package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureFive;
import com.ibcs.idsdp.dpptapp.services.TppAnnexureFiveService;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureFiveDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureFiveRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping("/tapp-annexure-five")

public class TappAnnexureFiveController {

    private final TppAnnexureFiveService tppAnnexureFiveService;

    public TappAnnexureFiveController(TppAnnexureFiveService tppAnnexureFiveService) {
        this.tppAnnexureFiveService = tppAnnexureFiveService;
    }

    @PostMapping("/create")
    private ResponseWithResults save(@RequestBody TppAnnexureFiveRequest response) {
        return tppAnnexureFiveService.save(response);
    }

    @GetMapping(path = "get-list/" + "{projectUuid}" , produces = "application/json")
    public List<TppAnnexureFive> getFirstRowData(@PathVariable String projectUuid) {
        return tppAnnexureFiveService.getListByProConceptUuid(projectUuid);
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<ResponseStatus> deletePost(@PathVariable Long id) {
        var isRemoved = tppAnnexureFiveService.deleteRow(id);
        return isRemoved;
    }
}
