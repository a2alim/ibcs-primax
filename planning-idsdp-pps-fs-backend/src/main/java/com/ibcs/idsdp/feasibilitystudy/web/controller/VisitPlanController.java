package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.VisitPlanConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VisitPlan;
import com.ibcs.idsdp.feasibilitystudy.services.VisitPlanService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.VisitPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VisitPlanRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(VisitPlanConstant.VISIT_PLAN)
public class VisitPlanController extends BaseController<VisitPlan, VisitPlanDTO> {
    private final VisitPlanService visitPlanService;

    public VisitPlanController(BaseService<VisitPlan, VisitPlanDTO> baseService, VisitPlanService visitPlanService) {
        super(baseService);
        this.visitPlanService = visitPlanService;
    }

    @PostMapping(path = VisitPlanConstant.GET_VISIT_PLAN_LIST, produces = "application/json")
    public Page<VisitPlanDTO> getVisitPlanByFspMasterId(@RequestBody VisitPlanRequest request) {
        return visitPlanService.getVisitPlanByFspMasterId(request);
    }
}
