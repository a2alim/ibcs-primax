package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.DppLocationDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppLocationResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.LocationAndCostResponse;

public interface DppLocationService {

    DppLocationResponse getByObjectiveCostId(Long objectiveCostId);

    DppLocationResponse getByProjectSummaryId(Long projectSummaryId);

    LocationAndCostResponse getLocationByObjectiveCostIdUsingProjectSummary(Long objectiveCostId);

    public DppLocationDTO getLocationByDppMasterId(Long dppMasterId);
}
