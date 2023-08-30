package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectInfoSendToGisRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


//@FeignClient(value = "GIS-BACKEND", url = "${feign.client.gis-backend}")
@FeignClient( value = "GIS-BACKEND", url = "http://123.49.44.29:8012/")
public interface GisClientService {

    @PostMapping("gis/api/sendProjectData")
    public @ResponseBody
    ResponseStatus sendProjectData(@RequestBody ProjectInfoSendToGisRequestDTO requestBodyDTO);
}
