package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.TappFinancingAndExpectationConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappFinancingAndExpectation;
import com.ibcs.idsdp.dpptapp.services.TappFinancingAndExpectationService;
import com.ibcs.idsdp.dpptapp.web.dto.TappFinancingAndExpectationDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappModeFinancingDTO;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(TappFinancingAndExpectationConstant.FINANCING_EXPECTATION)
public class TappFinancingAndExpectaionController extends BaseController<TappFinancingAndExpectation, TappFinancingAndExpectationDTO> {

    private final TappFinancingAndExpectationService tappFinancingAndExpectationService;

    public TappFinancingAndExpectaionController(BaseService<TappFinancingAndExpectation, TappFinancingAndExpectationDTO> baseService, TappFinancingAndExpectationService tappFinancingAndExpectationService) {
        super(baseService);
        this.tappFinancingAndExpectationService = tappFinancingAndExpectationService;
    }


    @PostMapping(TappFinancingAndExpectationConstant.CREATE_FINANCING_EXPECTATION)
    public TappFinancingAndExpectation createFinanceExpectatin(@RequestBody TappFinancingAndExpectationDTO tappFinancingAndExpectationDTO) {

        return tappFinancingAndExpectationService.saveFinancingExpectation(tappFinancingAndExpectationDTO);
    }

    @GetMapping(TappFinancingAndExpectationConstant.GET_FINANCING_EXPECTATION + '/'+"{pcUuid}")
    public ResponseWithResults getFinancingExpectation(@PathVariable String pcUuid){
        return tappFinancingAndExpectationService.getFinancingExpectation(pcUuid);
    }

    @PutMapping(TappFinancingAndExpectationConstant.UPDATE_FINANCING_EXPECTATION + '/'+"{pcUuid}")
    public TappFinancingAndExpectation updateFinancingExpectation(@RequestBody TappFinancingAndExpectationDTO dto, @PathVariable String pcUuid){
        return tappFinancingAndExpectationService.updateFinancingExpectation(dto, pcUuid);
    }
}