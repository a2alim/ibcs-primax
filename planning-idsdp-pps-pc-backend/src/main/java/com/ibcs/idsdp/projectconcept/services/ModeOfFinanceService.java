package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.ModeOfFianceRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ModeOfFinanceService {

    Page<ModeOfFinanceDTO> getProjectSummaryByProjectType(ModeOfFianceRequest request);

    List<ModeOfFinanceDTO> getProjectSummaryByProjectType(Long projectConceptMasterId);
}
