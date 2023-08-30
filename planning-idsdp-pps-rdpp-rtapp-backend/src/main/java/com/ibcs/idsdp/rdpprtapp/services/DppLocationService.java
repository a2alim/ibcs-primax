package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppLocationResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LocationAndCostResponse;

public interface DppLocationService {

    DppLocationResponse getByObjectiveCostId(Long objectiveCostId);

    DppLocationResponse getByProjectSummaryId(Long projectSummaryId);

    LocationAndCostResponse getLocationByObjectiveCostIdUsingProjectSummary(Long objectiveCostId);

}
