package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.web.dto.TappWorkScheduleDto;

import java.util.List;

public interface TappWorkScheduleService {

    /**
     *
     * @param rtappMasterId
     * @return
     */
    ResponseWithResults getAllWorkPlan(Long rtappMasterId);

    /**
     *
     * @param pmWorkPlanRequestDtoList
     * @return
     */
    ResponseWithResults saveWorkPlanList(List<TappWorkScheduleDto> pmWorkPlanRequestDtoList);

    /**
     *
     * @param id
     * @return
     */
    ResponseWithResults deleteWorkPlan(Long id);

}
