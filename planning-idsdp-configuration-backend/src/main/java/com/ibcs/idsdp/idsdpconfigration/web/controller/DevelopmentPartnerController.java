package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.web.dto.request.IdentificationDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.DevelopmentPartnerConstant;
import com.ibcs.idsdp.idsdpconfigration.services.implementation.DevelopmentPatnerService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DevelopmentPatnerRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.DevelopmentPatnerResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(DevelopmentPartnerConstant.DEVELOPMENT_PARTNER)
public class DevelopmentPartnerController {

    private final DevelopmentPatnerService developmentPatnerService;

    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ResponseEntity<IdentificationDTO> createApprovalStatus(@RequestBody DevelopmentPatnerRequest developmentPatnerRequest) {

        return new ResponseEntity(developmentPatnerService.createDevelopmentDevelopmentPartner(developmentPatnerRequest), HttpStatus.CREATED);
    }

    @GetMapping(DevelopmentPartnerConstant.GET_DEVELOPMENT_PARTNER)
    public ResponseEntity<List<DevelopmentPatnerResponse>> getAllApprovalStatus() {

        return new ResponseEntity(developmentPatnerService.getAllActiveDevelopmentPartnerList(), HttpStatus.OK);
    }

    @GetMapping(path = DevelopmentPartnerConstant.GET_BY_UUID_FOUND)
    public ResponseEntity<DevelopmentPatnerResponse> getAllApprovalStatusBy(@PathVariable String uuid) {

        return new ResponseEntity(developmentPatnerService.getDevelopmentPartnerListBy(uuid), HttpStatus.OK);
    }

    @PutMapping(path = DevelopmentPartnerConstant.UPDATE_ALL)
    public ResponseEntity<Void> updateAllApprovalStatusBy(@PathVariable String uuid, @RequestBody DevelopmentPatnerRequest developmentPatnerRequest) {

        developmentPatnerService.updateDevelopmentPartnerBy(uuid, developmentPatnerRequest);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = DevelopmentPartnerConstant.DELETE_ALL_BY)
    public ResponseEntity<Void> deleteAllApprovalStatusBy(@PathVariable String uuid) {

        developmentPatnerService.deleteDevelopmentPartnerBy(uuid);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @GetMapping(DevelopmentPartnerConstant.GET_BY_ID+"/{id}")
    public DevelopmentPatnerResponse getById(@PathVariable("id") @NotNull Long id) {
        return developmentPatnerService.getById(id);
    }

}
