package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.request.PlisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ResponseStatusDTO;


public interface PlisService {

    ResponseStatusDTO savePlisPdfUrl(PlisRequestDTO request);
}
