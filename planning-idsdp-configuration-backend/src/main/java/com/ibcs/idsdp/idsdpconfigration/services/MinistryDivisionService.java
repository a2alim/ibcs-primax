package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.MinistryDivisionDTO;
import org.springframework.data.domain.Page;


public interface MinistryDivisionService {

    Page<MinistryDivisionDTO> getActiveMinistryDivision(PageableRequestBodyDTO pageableRequestBodyDTO);

    MinistryDivisionDTO getByNameEn(String nameEn);

    MinistryDivisionDTO getByCode(String nameEn);
}
