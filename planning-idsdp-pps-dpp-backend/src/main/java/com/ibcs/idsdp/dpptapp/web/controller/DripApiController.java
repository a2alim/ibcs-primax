package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DripApiConstant;
import com.ibcs.idsdp.dpptapp.services.DripApiService;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlRequestDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping(DripApiConstant.DRIP_API_ENDPOINT)
public class DripApiController {

    private final DripApiService dripApiService;

    @GetMapping(path = DripApiConstant.GET_INDICATORS, produces = "application/json")
    public List<IndicatorDTO> getIndicators() {
        return dripApiService.getIndicatorList();
    }

    @PostMapping(path = DripApiConstant.GET_INDICATORS_URL, produces = "application/json")
    public IndicatorUrlListDTO getIndicatorUrls(@RequestBody IndicatorUrlRequestDTO requestDTO) {
        return dripApiService.getIndicatorUrl(requestDTO);
    }
}

