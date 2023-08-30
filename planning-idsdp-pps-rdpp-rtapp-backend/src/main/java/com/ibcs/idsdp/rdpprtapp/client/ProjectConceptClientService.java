package com.ibcs.idsdp.rdpprtapp.client;

import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.rdpprtapp.client.dto.response.ProjectLocationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "${feign.client.project-concept}")
//@FeignClient( value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "http://localhost:8085/pps-pc/")
public interface ProjectConceptClientService {

    @GetMapping("projectLocation/getByProjectSummaryId/{projectSummaryId}")
    public @ResponseBody
    ProjectLocationResponse getByProjectSummaryId(@PathVariable Long projectSummaryId);

    @GetMapping("projectConcept/get-by-uuid/{uuid}")
    public @ResponseBody
    ProjectConceptResponse getProjectConceptByUuid(@PathVariable String uuid);

    @GetMapping("projectConcept/projectConceptIdListByAgency")
    public @ResponseBody
    List<Long> getProjectConceptIdListByAgency();

    @PostMapping("projectConcept/updateMovementTimeByPcId")
    public @ResponseBody ProjectConceptResponse updateMovementTimeByPcId(@RequestBody IdHolderRequestBodyDTO request);
}
