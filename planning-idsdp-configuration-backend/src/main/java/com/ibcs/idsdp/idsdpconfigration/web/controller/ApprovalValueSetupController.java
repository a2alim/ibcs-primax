package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ApprovalValueSetupConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalValueSetup;
import com.ibcs.idsdp.idsdpconfigration.services.ApprovalValueSetupService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ApprovalValueSetupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(ApprovalValueSetupConstant.APPROVALVALUESETUP)
public class ApprovalValueSetupController extends BaseController<ApprovalValueSetup, ApprovalValueSetupRequest> {

    private final ApprovalValueSetupService approvalValueSetupService;

    public ApprovalValueSetupController(BaseService<ApprovalValueSetup, ApprovalValueSetupRequest> baseService, ApprovalValueSetupService approvalValueSetupService) {
        super(baseService);
        this.approvalValueSetupService = approvalValueSetupService;
    }

    @GetMapping(ApprovalValueSetupConstant.GET_ACTIVE_APPROVALVALUESETUP)
    public ResponseEntity<List<ApprovalValueSetupRequest>> getActiveApprovalValueSetup() {
        return approvalValueSetupService.getActiveApprovalValueSetup();
    }


    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ApprovalValueSetupRequest create(@RequestBody ApprovalValueSetupRequest approvalValueSetupRequest) {
        approvalValueSetupRequest.setCode(approvalValueSetupService.generateCodeNumber("AV-Pa-"+approvalValueSetupRequest.getParipatroVersionNo())); //To Do after developed paripotro
        return super.create(approvalValueSetupRequest);
    }
}
