package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.enums.ResearcherProfileMarksCategory;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileMarksResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProfileMarksService {

	Response<ResearcherProfileMarksResponseDto> getByResearcherProposalIdAndCategory(Long researcherProposalId, Long categoryId);

}
