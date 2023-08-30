package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.EconomicCodeConstant;
import com.ibcs.idsdp.idsdpconfigration.constants.SubEconomicCodeConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.EconomicCode;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubEconomicCode;
import com.ibcs.idsdp.idsdpconfigration.services.EconomicCodeService;
import com.ibcs.idsdp.idsdpconfigration.services.SubEconomicCodeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.EconomicCodeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubEconomicCodeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.EcCodeWithSubEcCode;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SubEconomicCodeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestApiController
@RequestMapping(SubEconomicCodeConstant.SUB_ECONOMIC_CODE)
public class SubEconomicCodeController extends BaseController<SubEconomicCode, SubEconomicCodeRequest> {

    private final SubEconomicCodeService subEconomicCodeService;

    public SubEconomicCodeController(BaseService<SubEconomicCode, SubEconomicCodeRequest> baseService, SubEconomicCodeService subEconomicCodeService) {
        super(baseService);
        this.subEconomicCodeService = subEconomicCodeService;
    }

    @GetMapping(SubEconomicCodeConstant.GET_ACTIVE_SUB_ECONOMICCODE)
    public ResponseEntity<List<SubEconomicCodeRequest>> getActiveSubEconomicCode() {
        return subEconomicCodeService.getActiveSubEconomicCode();
    }


    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public SubEconomicCodeRequest create(@RequestBody SubEconomicCodeRequest subEconomicCodeRequest) {
        subEconomicCodeRequest.setCode(subEconomicCodeService.generateCodeNumber(subEconomicCodeRequest.getSubEconomicCodeName()));
        return super.create(subEconomicCodeRequest);
    }

    @GetMapping(path= SubEconomicCodeConstant.GET_BY_ECONOMIC_CODE_ID + "/{economicCodeId}", produces = "application/json")
    public List<SubEconomicCodeRequest> getByEconomicCodeId(@PathVariable("economicCodeId") long economicCodeId) {
        return subEconomicCodeService.getByEconomicCodeId(economicCodeId);
    }

    @PostMapping(path= SubEconomicCodeConstant.GET_BY_ECONOMIC_CODES, produces = "application/json")
    public ResponseEntity<List<EcCodeWithSubEcCode>> getSubEconomicCodeByEconomicCodeSet(@RequestBody IdSetRequestBodyDTO economicCodes) {
        return subEconomicCodeService.getSubEconomicCodeByEconomicCodeSet(economicCodes.getIds());
    }
}
