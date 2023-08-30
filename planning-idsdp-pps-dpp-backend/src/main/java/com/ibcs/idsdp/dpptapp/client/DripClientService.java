package com.ibcs.idsdp.dpptapp.client;

import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.AuthenticateRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlsRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@FeignClient( value = "DRIP-BACKEND", url = "http://drip.plancomm.gov.bd/")
public interface DripClientService {

    @PostMapping("api/indicators/Authenticate")
    public @ResponseBody
    String getAccessToken(@RequestHeader Map<String,Object> headerMap, @RequestBody AuthenticateRequestDTO request);

    @GetMapping("api/indicators")
    public @ResponseBody
    List<IndicatorDTO> getIndicators(@RequestHeader Map<String,Object> headerMap);

    @PostMapping("api/indicators/getUrl")
    public @ResponseBody
    IndicatorUrlListDTO getIndicatorsUrl(@RequestHeader Map<String,Object> headerMap, @RequestBody IndicatorUrlsRequestDTO request);
}
