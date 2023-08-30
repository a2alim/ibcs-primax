package com.ibcs.idsdp.projectconcept.client;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.projectconcept.client.dto.ProjectMovementStageDTO;
import com.ibcs.idsdp.projectconcept.client.dto.response.AnnexureAmountDTO;
import com.ibcs.idsdp.projectconcept.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.DppLocationResponse;
import com.ibcs.idsdp.projectconcept.web.dto.location.LocationAndCostResponse;
import com.ibcs.idsdp.projectconcept.web.dto.response.DppObjectiveCostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(value = "planning-idsdp-pps-dpptapp-backend", url = "${feign.client.pps-dpp-tapp}")
public interface DppClientService {

    @GetMapping("project-movement-stage/get-stage-by-user-id/{userId}")
    @ResponseBody
    List<ProjectMovementStageDTO> getAllStageByUserId(@PathVariable Long userId);


    @PostMapping("objective-cost/get-all-stages-by-pc-ids")
    @ResponseBody
    AgencyDashboardDTO getAllStagesByPcIds(@RequestBody AgencyDashboardDTO ids);


    @GetMapping("project-movement-stage/get-ministry-approved-pc-ids")
    @ResponseBody
    ResponseWithResults getApprovedProjectConcepts();

    @PostMapping("dpp-dashboard/getGrandTotalByPcIds")
    @ResponseBody
    Map<Long, AnnexureAmountDTO> getGrandTotalByPcIds(@RequestBody Set<Long> pcIds);

    @GetMapping("objective-cost/get-dpp-master-data/{pcUuid}")
    @ResponseBody
    DppObjectiveCostDTO getDppObjectiveCostByPcUuid(@PathVariable String pcUuid);

    @GetMapping("tapp-objective-cost/get-tapp-master-data/{pcUuid}")
    @ResponseBody
    DppObjectiveCostDTO getTappObjectiveCostByPcUuid(@PathVariable String pcUuid);

    @GetMapping("dppLocation/getByProjectSummaryId/{projectSummaryId}")
    @ResponseBody
    DppLocationResponse getSelectedLocationByPcId(@PathVariable Long projectSummaryId);

    @GetMapping("dppLocation/getByObjectiveCostIdUsingProjectSummary/{projectSummaryId}")
    @ResponseBody
    LocationAndCostResponse getLocationByPcId(@PathVariable Long projectSummaryId);
}
