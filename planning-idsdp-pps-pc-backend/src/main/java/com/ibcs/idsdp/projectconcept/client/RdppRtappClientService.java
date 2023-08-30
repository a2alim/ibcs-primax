package com.ibcs.idsdp.projectconcept.client;

import com.ibcs.idsdp.projectconcept.client.dto.FsSummaryDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.ApprovalAndNotApprovalProjectListResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@FeignClient(value = "PLANNING-IDSDP-PPS-RDPP-RTAPP-BACKEND", url = "${feign.client.pps-rdpp-rtapp}")
public interface RdppRtappClientService {


    @GetMapping("objective-cost/getAllApprovalAndNotApprovalProjects/")
    @ResponseBody
    ApprovalAndNotApprovalProjectListResponseDTO getApprovedNotApprovedRdppRtapp();

}
