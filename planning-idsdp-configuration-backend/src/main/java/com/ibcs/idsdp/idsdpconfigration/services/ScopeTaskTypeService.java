package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ScopeTaskTypeDTO;
import org.springframework.data.domain.Page;

public interface ScopeTaskTypeService {
    Page<ScopeTaskTypeDTO> getActiveScopeTaskType(PageableRequestBodyDTO pageableRequestBodyDTO);
}
