package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UnitTypeRequest;
import org.springframework.data.domain.Page;

public interface UnitTypeService {
    Page<UnitTypeRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO);
    String generateCodeNumber(String code);
}
