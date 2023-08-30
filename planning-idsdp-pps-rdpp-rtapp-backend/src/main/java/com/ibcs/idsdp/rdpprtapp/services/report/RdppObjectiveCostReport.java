package com.ibcs.idsdp.rdpprtapp.services.report;

import com.ibcs.idsdp.rdpprtapp.web.dto.report.RdppObjectiveAndCostAllResponse;

public interface RdppObjectiveCostReport {
    RdppObjectiveAndCostAllResponse getProjectSummaryByPcUuidId(String pcUuid);

}
