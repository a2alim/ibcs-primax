package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountRequestDTO;
import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountResponseDTO;

import java.util.List;

public interface ProjectInfoService {
    List<GisProjectCountResponseDTO> getProjectCountByDivisionAndZilla(GisProjectCountRequestDTO requestDTO);
}
