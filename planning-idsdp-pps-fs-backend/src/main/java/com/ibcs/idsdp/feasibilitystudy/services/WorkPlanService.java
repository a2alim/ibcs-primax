package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.WorkPlanDtoDetails;

import java.util.List;

public interface WorkPlanService {

    WorkPlanDTO createWorkPlan(WorkPlanDTO workPlanDTO, Long fspMasterId);

    List<WorkPlanDtoDetails> getWorkPlanListByFspMasterId(Long fspMasterId);

    WorkPlanDTO updateWorkPlan(WorkPlanDTO workPlanDTO, Long fspMasterId);
}
