package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.PscWorkingPlanConstant;
import com.ibcs.idsdp.dpptapp.model.domain.PscWorkingPlan;
import com.ibcs.idsdp.dpptapp.services.IPscWorkingPlanService;
import com.ibcs.idsdp.dpptapp.web.dto.PscWorkingPlanDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.PortUnreachableException;

@RestApiController
@RequestMapping(PscWorkingPlanConstant.PSC_WORKING_PLAN)
public class PscWorkingPlanController extends BaseController<PscWorkingPlan, PscWorkingPlanDTO> {

    private final IPscWorkingPlanService iPscWorkingPlanService;

    PscWorkingPlanController(BaseService<PscWorkingPlan, PscWorkingPlanDTO> baseService, IPscWorkingPlanService iPscWorkingPlanService) {
        super(baseService);
        this.iPscWorkingPlanService = iPscWorkingPlanService;
    }

    @GetMapping(path = PscWorkingPlanConstant.GET_BY_PC_ID + "/{pcUuid}/{paperType}/{userType}", produces = "application/json")
    public PscWorkingPlanDTO getPscWorkingPlanByPcId(@PathVariable String pcUuid, @PathVariable String paperType,@PathVariable String userType){
        return iPscWorkingPlanService.getPscWorkingPlanByPcId(pcUuid, paperType, userType);
    }

    @GetMapping(path = PscWorkingPlanConstant.GET_FULL_PSC_BY_PC_UUID + "/{uuid}/{pscPaperType}/{userType}", produces = "application/json")
    public PscWorkingPlanDTO getPscWorkingPlanWithObjectiveAndCostByPcUuid(@PathVariable String uuid, @PathVariable String pscPaperType, @PathVariable String userType){
        return iPscWorkingPlanService.getPscWorkingPlanWithObjectiveAndCostByPcUuid(uuid, pscPaperType, userType);
    }
}
