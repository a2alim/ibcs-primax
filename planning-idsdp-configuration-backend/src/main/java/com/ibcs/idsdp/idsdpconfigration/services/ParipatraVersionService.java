package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ParipatraVersionDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ParipatraVersionService {

    Page<ParipatraVersionDTO> getActiveParipatraVersion(PageableRequestBodyDTO pageableRequestBodyDTO);

    ResponseEntity<ParipatraVersionDTO> getActiveSingleParipatraVersion();

    List<ParipatraVersionDTO> getActiveParipatraList();
}
