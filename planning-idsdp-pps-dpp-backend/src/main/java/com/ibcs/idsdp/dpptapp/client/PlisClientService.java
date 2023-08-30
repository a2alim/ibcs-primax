package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.dpptapp.web.dto.response.PlisProjectResponseDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.PlisProjectShortInfoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient( value = "PLIS-BACKEND", url = "http://118.179.197.118:4050")
public interface PlisClientService {

    @PostMapping("pps/dpp/")
    public @ResponseBody
    PlisProjectResponseDTO sendProjectToPlis(@RequestBody PlisProjectShortInfoDTO request);
}
