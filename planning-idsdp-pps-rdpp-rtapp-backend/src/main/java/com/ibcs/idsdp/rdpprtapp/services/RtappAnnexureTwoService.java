package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.RtappAnnexureTwoDto;

import java.util.List;

public interface RtappAnnexureTwoService {

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
    ResponseWithResults saveWorkPlanList(List<RtappAnnexureTwoDto> pmWorkPlanRequestDtoList);

    /**
     *
     * @param id
     * @return
     */
    ResponseWithResults deleteWorkPlan(Long id);

}
