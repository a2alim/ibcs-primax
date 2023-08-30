package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.web.dto.misDTO.MisQueryRequest;
import com.ibcs.idsdp.dpptapp.web.dto.pageable.PageableResponse;


public interface MisQueryService {
    PageableResponse applyMisQuery(MisQueryRequest request);
}
