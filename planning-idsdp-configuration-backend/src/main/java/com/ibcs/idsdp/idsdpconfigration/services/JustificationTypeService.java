package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.JustificationTypeDTO;
import org.springframework.data.domain.Page;

public interface JustificationTypeService {

    Page<JustificationTypeDTO> getActiveJustificationType(PageableRequestBodyDTO pageableRequestBodyDTO);
}
