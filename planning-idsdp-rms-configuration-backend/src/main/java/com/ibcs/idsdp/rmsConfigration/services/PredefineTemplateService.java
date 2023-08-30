package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.PredefineTemplate;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.PredefineTemplateRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.util.Response;

public interface PredefineTemplateService {

    Response<PredefineTemplateResponseDto> createPredefineTemplate(PredefineTemplateRequestDto predefineTemplateRequestDto);

    Response<PredefineTemplateResponseDto> updatePredefineTemplate(PredefineTemplateRequestDto predefineTemplateRequestDto);

    Response<PredefineTemplate> getActiveById(Integer id);
    Response<PredefineTemplateResponseDto> getByTemplateTypeId(Integer templateTypeId);
    
    Response<PredefineTemplateResponseDto> findById(Long id);

}
