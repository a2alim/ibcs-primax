package com.ibcs.idsdp.idsdpconfigration.web.controller;


import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ProcurementTypeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProcurementType;
import com.ibcs.idsdp.idsdpconfigration.services.ProcurementTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProcurementTypeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementTypeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(ProcurementTypeConstant.PROCUREMENT_TYPE)
public class ProcurementTypeController extends BaseController<ProcurementType, ProcurementTypeRequest> {

    private final ProcurementTypeService procurementTypeService;

    public ProcurementTypeController(BaseService<ProcurementType, ProcurementTypeRequest> service, ProcurementTypeService procurementTypeService) {
        super(service);
        this.procurementTypeService = procurementTypeService;
    }

    /*
     * GET ALL ACTIVE PROCUREMENT TYPE
     * @return List<ProcurementTypeResponse>
     */

    @GetMapping(ProcurementTypeConstant.GET_ALL_ACTIVE_PROCUREMENT_TYPE)
    public ResponseEntity<List<ProcurementTypeResponse>> getActiveProcurementTypes() {
        return procurementTypeService.getActiveProcurementTypes();
    }

    /*
     * CREATE for ProcurementType
     * @param procurementTypeRequest
     * @return ProcurementTypeRequest
     */

    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ProcurementTypeRequest create(@RequestBody ProcurementTypeRequest procurementTypeRequest) {
        procurementTypeRequest.setCode(procurementTypeService.generateCodeNumber(procurementTypeRequest.getNameEn()));
        return super.create(procurementTypeRequest);
    }
}
