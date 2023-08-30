package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.PscWorkingPlanConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.PscWorkingPlan;
import com.ibcs.idsdp.rdpprtapp.services.IPscWorkingPlanService;
import com.ibcs.idsdp.rdpprtapp.web.dto.PscWorkingPlanDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(PscWorkingPlanConstant.PSC_WORKING_PLAN)
public class PscWorkingPlanController extends BaseController<PscWorkingPlan, PscWorkingPlanDTO> {

    private final IPscWorkingPlanService iPscWorkingPlanService;

    PscWorkingPlanController(BaseService<PscWorkingPlan, PscWorkingPlanDTO> baseService, IPscWorkingPlanService iPscWorkingPlanService) {
        super(baseService);
        this.iPscWorkingPlanService = iPscWorkingPlanService;
    }

    @GetMapping(path = PscWorkingPlanConstant.GET_BY_PC_ID + "/{id}", produces = "application/json")
    public PscWorkingPlanDTO getPscWorkingPlanByPcId(@PathVariable Long id){
        return iPscWorkingPlanService.getPscWorkingPlanByPcId(id);
    }

    @GetMapping(path = PscWorkingPlanConstant.GET_FULL_PSC_BY_PC_UUID + "/{uuid}", produces = "application/json")
    public PscWorkingPlanDTO getPscWorkingPlanWithObjectiveAndCostByPcUuid(@PathVariable String uuid){
        return iPscWorkingPlanService.getPscWorkingPlanWithObjectiveAndCostByPcUuid(uuid);
    }
}
