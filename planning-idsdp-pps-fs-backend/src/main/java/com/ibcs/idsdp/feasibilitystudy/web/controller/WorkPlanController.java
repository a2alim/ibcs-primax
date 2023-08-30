package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.WorkPlanConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.WorkPlan;
import com.ibcs.idsdp.feasibilitystudy.services.WorkPlanService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDtoDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(WorkPlanConstant.WORK_PLAN)
public class WorkPlanController extends BaseController<WorkPlan, WorkPlanDTO> {
    private WorkPlanService workPlanService;

    public WorkPlanController(BaseService<WorkPlan, WorkPlanDTO> service, WorkPlanService workPlanService) {
        super(service);
        this.workPlanService = workPlanService;
    }

    @PostMapping(path = WorkPlanConstant.CREATE, produces = "application/json")
    public WorkPlanDTO create(@RequestBody WorkPlanDTO workPlanDTO, @PathVariable Long fspMasterId) {
        return workPlanService.createWorkPlan(workPlanDTO, fspMasterId);
    }

    @GetMapping(path = WorkPlanConstant.GET_WORK_PLAN_LIST, produces = "application/json")
    public List<WorkPlanDtoDetails> getWorkPlanListByFspMasterId(@PathVariable Long fspMasterId) {
        return workPlanService.getWorkPlanListByFspMasterId(fspMasterId);
    }

    @PutMapping(path = WorkPlanConstant.UPDATE, produces = "application/json")
    public WorkPlanDTO update( @RequestBody WorkPlanDTO workPlanDTO, @PathVariable Long fspMasterId) {
        return workPlanService.updateWorkPlan(workPlanDTO, fspMasterId);
    }

}
