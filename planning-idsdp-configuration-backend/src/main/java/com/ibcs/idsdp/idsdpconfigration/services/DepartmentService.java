package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DepartmentDTO;
import org.springframework.data.domain.Page;

public interface DepartmentService {

    Page<DepartmentDTO> getActiveDepartment(PageableRequestBodyDTO pageableRequestBodyDTO);
}
