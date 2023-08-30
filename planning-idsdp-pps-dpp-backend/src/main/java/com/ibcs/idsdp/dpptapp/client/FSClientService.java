package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.dpptapp.client.dto.response.FspSummaryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;


@FeignClient(value = "PLANNING-IDSDP-PPS-FS-BACKEND", url = "${feign.client.pps-fs}")
//@FeignClient( value = "PLANNING-IDSDP-PPS-FS-BACKEND", url = "http://localhost:8086/pps-fs/")
public interface FSClientService {

    @GetMapping("fsp-summary/get-by-id/{id}")
    @ResponseBody
    FspSummaryDTO getFspSummaryById(@PathVariable Long id);

}
