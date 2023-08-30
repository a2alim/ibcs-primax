package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.PscWorkingPlanDTO;

public interface IPscWorkingPlanService {
    PscWorkingPlanDTO getPscWorkingPlanByPcId(Long id);

    PscWorkingPlanDTO getPscWorkingPlanWithObjectiveAndCostByPcUuid(String uuid);
}
