package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ProcurementMethodConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementMethod;
import com.ibcs.idsdp.idsdpconfigration.services.ProcurementMethodService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProcurementMethodRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementMethodResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(ProcurementMethodConstant.PROCUREMENT_METHOD)
public class ProcurementMethodController extends BaseController<ProcurementMethod, ProcurementMethodRequest> {
    private final ProcurementMethodService procurementMethodService;

    public ProcurementMethodController(BaseService<ProcurementMethod, ProcurementMethodRequest> service, ProcurementMethodService procurementMethodService) {
        super(service);
        this.procurementMethodService = procurementMethodService;
    }

    /*
     * GET ALL ACTIVE PROCUREMENT_METHOD
     * @return List<ProcurementMethodResponse>
     */

    @GetMapping(ProcurementMethodConstant.GET_ALL_ACTIVE_PROCUREMENT_METHOD)
    public ResponseEntity<List<ProcurementMethodResponse>> getActiveProcurementMethods() {
        return procurementMethodService.getActiveProcurementMethods();
    }

    /*
     * create for ProcurementMethod
     * @param procurementMethodRequest
     * @return ProcurementMethodRequest
     */

    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ProcurementMethodRequest create(@RequestBody ProcurementMethodRequest procurementMethodRequest) {
        procurementMethodRequest.setCode(procurementMethodService.generateCodeNumber(procurementMethodRequest.getNameEn()));
        return super.create(procurementMethodRequest);
    }
}
