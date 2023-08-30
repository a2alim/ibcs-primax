package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DetailsCofogDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DetailsCofogService {

    Page<DetailsCofogDTO> getActiveDetailsCofog(PageableRequestBodyDTO pageableRequestBodyDTO);

    List<DetailsCofogDTO>  getByOptionalCofog(long optionalCofogId);
}
