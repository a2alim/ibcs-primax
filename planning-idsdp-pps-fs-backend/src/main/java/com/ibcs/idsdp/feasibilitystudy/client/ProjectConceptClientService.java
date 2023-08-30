package com.ibcs.idsdp.feasibilitystudy.client;

import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ProjectConceptShortInfoDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.response.ProjectConceptMasterDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.response.ProjectLocationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "${feign.client.project-concept}")
//@FeignClient(value = "PLANNING-IDSDP-PPS-PC-BACKEND", url = "http://localhost:8081/pps-pc/")
public interface ProjectConceptClientService {

    @GetMapping("projectLocation/getByProjectSummaryId/{projectSummaryId}")
    @ResponseBody
    ProjectLocationResponse getByProjectSummaryId(@PathVariable Long projectSummaryId);

    @PostMapping("projectConcept/updateMovementTimeByPcId")
    public @ResponseBody ProjectConceptMasterDTO updateMovementTimeByPcId(@RequestBody IdHolderRequestBodyDTO request);

    @PostMapping("projectConcept/updateProjectConceptShortInfo")
    public @ResponseBody
    ProjectConceptMasterDTO updateProjectShortInfo(@RequestBody ProjectConceptShortInfoDTO request);
}
