package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlListDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dripDTO.IndicatorUrlRequestDTO;

import java.util.List;

public interface DripApiService {

    List<IndicatorDTO> getIndicatorList();

    IndicatorUrlListDTO getIndicatorUrl(IndicatorUrlRequestDTO requestDTO);
}
