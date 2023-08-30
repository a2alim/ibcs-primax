package com.ibcs.idsdp.rpm.services;

import org.springframework.data.domain.Page;

import com.ibcs.idsdp.rpm.web.dto.request.ResearchActionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearchActionService {

	public Response<ResearchActionResponseDto> save(ResearchActionRequestDto researchActionRequestDto);

	Page<ResearchActionResponseDto> getAllResearchAction(ResearchActionRequestDto researchActionRequestDto);
}
