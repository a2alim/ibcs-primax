package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.web.dto.request.IdentificationDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ApprovalStatusConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalStatus;
import com.ibcs.idsdp.idsdpconfigration.services.implementation.ApprovalStatusService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ApprovalStatusRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ApprovalStatusResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(ApprovalStatusConstant.APPROVAL_STATUS)
public class ApprovalStatusController {

    private final ApprovalStatusService approvalStatusService;

    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ResponseEntity<IdentificationDTO> createApprovalStatus(@RequestBody ApprovalStatusRequest approvalStatusRequest) {

        return new ResponseEntity(approvalStatusService.createApprovalStatus(approvalStatusRequest), HttpStatus.CREATED);
    }

    @GetMapping(ApprovalStatusConstant.GET_APPROVAL_STATUS)
    public ResponseEntity<List<ApprovalStatusResponse>> getAllApprovalStatus() {

        return new ResponseEntity(approvalStatusService.getAllActiveApprovalStatusList(), HttpStatus.OK);
    }

    @GetMapping(path = ApprovalStatusConstant.GET_BY_UUID_FOUND)
    public ResponseEntity<ApprovalStatusResponse> getAllApprovalStatusBy(@PathVariable String uuid) {

        return new ResponseEntity(approvalStatusService.getAllActiveApprovalStatusListBy(uuid), HttpStatus.OK);
    }

    @PutMapping(path = ApprovalStatusConstant.UPDATE_ALL)
    public ResponseEntity<Void> updateAllApprovalStatusBy(@PathVariable String uuid, @RequestBody ApprovalStatusRequest approvalStatusRequest) {

        approvalStatusService.updateApprovalStatusBy(uuid, approvalStatusRequest);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(path = ApprovalStatusConstant.DELETE_ALL_BY)
    public ResponseEntity<Void> deleteAllApprovalStatusBy(@PathVariable String uuid) {

        approvalStatusService.deleteApprovalStatusBy(uuid);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @GetMapping(path = ApprovalStatusConstant.GET_ALL, produces = "application/json")
    public List<ApprovalStatus> getAll() {
        return approvalStatusService.getAll();
    }

}