package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.AgencyResponseDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import com.ibcs.idsdp.idsdpconfigration.web.dto.AgencyDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.sql.SQLException;
import java.util.List;

public interface AgencyService {

    Page<AgencyDTO> getActiveAgency(PageableRequestBodyDTO pageableRequestBodyDTO);

    ResponseEntity<List<AgencyDTO>> getByMinistryDivisionId(Long ministryDivisionId);

    AgencyDTO getByNameEn(String nameEn);

    List<AgencyResponseDTO> getActiveData() throws SQLException;

    AgencyDTO getByCode(String code);
}
