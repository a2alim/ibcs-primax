package com.ibcs.idsdp.rdpprtapp.client;

import com.ibcs.idsdp.rdpprtapp.web.dto.report.DppResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@FeignClient(value = "PLANNING-IDSDP-PPS-DPPTAPP-BACKEND", url = "${feign.client.pps-dpp-tapp}")
public interface PpsDppTappClientService {

    @GetMapping("dppAnnualPhasingCost/getGrandTotalByProjectConceptId/{projectConceptId}")
    @ResponseBody
    ResponseEntity<List<GrandTotalResponse>> getGrandTotalByProjectConceptId(@PathVariable Long projectConceptId);

    @GetMapping("tappAnnualPhasingCost/getGrandTotalByProjectConceptId/{projectConceptId}")
    @ResponseBody
    ResponseEntity<List<GrandTotalResponseTapp>> getTappGrandTotalByProjectConceptId(@PathVariable Long projectConceptId);

    @GetMapping("dppAnnualPhasingCost/getByProjectConceptIdAndComponentName")
    @ResponseBody
    ResponseEntity<DppAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(@RequestBody ProjectConceptIdAndComponentNameRequest projectConceptIdAndComponentNameRequest);

    @GetMapping("tappAnnualPhasingCost/getByProjectConceptIdAndComponentName")
    @ResponseBody
    ResponseEntity<TappAnnualPhasingCostWithChildResponse> getTappByProjectConceptIdAndComponentName(@RequestBody ProjectConceptIdAndComponentNameRequest projectConceptIdAndComponentNameRequest);

    @GetMapping("dppLocation/getByObjectiveCostIdUsingProjectSummary/{projectSummaryId}")
    @ResponseBody
    LocationAndCostResponse getDppLocationByProjectConceptId(@PathVariable Long projectSummaryId);

    @GetMapping("objective-cost//getByPcuuid/{pcUuid}")
    @ResponseBody
    DppResponse getDppObjectivesAndCostByPcUuid(@PathVariable String pcUuid);

}
