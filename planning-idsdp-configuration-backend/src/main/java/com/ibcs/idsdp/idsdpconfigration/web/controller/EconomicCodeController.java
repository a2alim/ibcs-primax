package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.EconomicCodeConstant;
import com.ibcs.idsdp.idsdpconfigration.constants.EconomicCodeFor;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import com.ibcs.idsdp.idsdpconfigration.services.EconomicCodeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.EconomicCodeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(EconomicCodeConstant.ECONOMIC_CODE)
public class EconomicCodeController extends BaseController<EconomicCode, EconomicCodeRequest> {

    private final EconomicCodeService economicCodeService;

    public EconomicCodeController(BaseService<EconomicCode, EconomicCodeRequest> baseService, EconomicCodeService economicCodeService) {
        super(baseService);
        this.economicCodeService = economicCodeService;
    }

    @GetMapping(EconomicCodeConstant.GET_ACTIVE_ECONOMICCODE)
    public ResponseEntity<List<EconomicCodeRequest>> getActiveEconomicCode() {
        return economicCodeService.getActiveEconomicCode();
    }


    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public EconomicCodeRequest create(@RequestBody EconomicCodeRequest economicCodeRequest) {
        economicCodeRequest.setCode(economicCodeService.generateCodeNumber(economicCodeRequest.getEconomicCodeName()));
        return super.create(economicCodeRequest);
    }
}
