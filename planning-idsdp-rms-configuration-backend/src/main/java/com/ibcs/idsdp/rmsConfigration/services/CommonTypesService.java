package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.CommonTypes;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommonTypesRequestDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CommonTypesService {
    Response<CommonTypesResponseDto> createCommonType(CommonTypesRequestDTO commonTypesRequestDTO);
    Response<CommonTypesResponseDto> updateCommonType(CommonTypesRequestDTO commonTypesRequestDTO);

    ResponseEntity<List<CommonTypes>> findAllByActiveData(Integer typeNo);
}
