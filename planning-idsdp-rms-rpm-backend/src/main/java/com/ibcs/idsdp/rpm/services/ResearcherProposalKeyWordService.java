package com.ibcs.idsdp.rpm.services;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalKeyWordRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalKeyWordResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalKeyWordService {
	
	Response<ResearcherProposalKeyWordResponseDto> createList(@RequestBody List<ResearcherProposalKeyWordRequestDto> researcherProposalKeyWordRequestList);

}
