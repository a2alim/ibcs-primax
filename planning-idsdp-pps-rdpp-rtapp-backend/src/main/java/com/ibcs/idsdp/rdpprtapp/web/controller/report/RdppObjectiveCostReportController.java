package com.ibcs.idsdp.rdpprtapp.web.controller.report;

import com.ibcs.idsdp.rdpprtapp.services.report.impl.RdppObjectiveCostReportImpl;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.RdppObjectiveAndCostAllResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/get-report/")
public class RdppObjectiveCostReportController {

    @Autowired
    RdppObjectiveCostReportImpl rdppProjectSummary;

    @GetMapping(path = "get-rdpp-project-summary-by/{pcUuid}", produces = "application/json")
    public RdppObjectiveAndCostAllResponse getProjectSummaryByPcUuidId(@PathVariable String pcUuid){
        return rdppProjectSummary.getProjectSummaryByPcUuidId(pcUuid);
    }
}
