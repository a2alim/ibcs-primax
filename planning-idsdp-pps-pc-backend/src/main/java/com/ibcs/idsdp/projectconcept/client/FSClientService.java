package com.ibcs.idsdp.projectconcept.client;

import com.ibcs.idsdp.projectconcept.client.dto.FsSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@FeignClient(value = "planning-idsdp-pps-fs-backend", url = "${feign.client.pps-fs}")
public interface FSClientService {

    @GetMapping("fs-summary/get-list")
    @ResponseBody
    List<FsSummaryDTO> getFsSummaryList();

    @GetMapping("fsp-summary/getFspSummaryList/{projectConceptMasterUuid}")
    @ResponseBody
    FsSummaryDTO getFspSummaryByPcUuid(@PathVariable String projectConceptMasterUuid);

    @GetMapping("fs-summary/getFsSummary/{projectConceptMasterUuid}")
    @ResponseBody
    FsSummaryDTO getFsSummaryByPcUuid(@PathVariable String projectConceptMasterUuid);

    @GetMapping("fs-summary/getFsSummary-by-pc-id/{pcId}")
    @ResponseBody
    FsSummaryDTO getFsSummaryByPCId(@PathVariable Long pcId);
}
