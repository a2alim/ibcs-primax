package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.TemplateType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.TemplateTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface TemplateTypeService {

    Response<TemplateTypeResponseDto> createTemplateType(TemplateTypeRequestDto templateTypeRequestDto);

    Response<TemplateTypeResponseDto> updateTemplateType(TemplateTypeRequestDto templateTypeRequestDto);

    Response<TemplateType> findAllByActive(boolean isDeleted, boolean isActive);

    Response<TemplateTypeResponseDto> findById(Long id);
}
