package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.PscWorkingPlanDTO;

public interface IPscWorkingPlanService {
    PscWorkingPlanDTO getPscWorkingPlanByPcId(String pcUuid, String pscPaperType, String userType);

    PscWorkingPlanDTO getPscWorkingPlanWithObjectiveAndCostByPcUuid(String uuid, String pscPaperType, String userType);
}
