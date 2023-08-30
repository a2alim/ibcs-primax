package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherPresentationResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherPresentationService {
	
	Response<CreateSeminarTimeScheduleResponseDto>  getResearchTittleListFindBySeminarId(String createSeminarUuid);
	Response<ResearcherPresentationResponseDto> getResearchPresentationBySeminarUuid(String seminarUuid);
	Response<ResearcherPresentationResponseDto> findByResearcherProposalId(Long researcherProposalId);
	Response<ResearcherPresentationResponseDto> findAllByResearcherProposalId(Long researcherProposalId);
	

}
