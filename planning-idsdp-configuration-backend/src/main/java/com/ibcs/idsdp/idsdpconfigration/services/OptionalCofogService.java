package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.OptionalCofogDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OptionalCofogService {

    Page<OptionalCofogDTO> getActiveOptionalCofog(PageableRequestBodyDTO pageableRequestBodyDTO);

    List<OptionalCofogDTO> getByMainCofogId(long mainCofogId);
}
