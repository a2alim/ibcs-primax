package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchGuideLine;
import com.ibcs.idsdp.rmsConfigration.services.ResearchGuideLineService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ResearchGuideLineRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchGuideLineResponseDto;

@RestApiController
@RequestMapping("api/research-guide-line")
public class ResearchGuideLineController extends BaseController<ResearchGuideLine, ResearchGuideLineRequestDto, ResearchGuideLineResponseDto>{
	
	private final ResearchGuideLineService researchGuideLineService;

	public ResearchGuideLineController(BaseService<ResearchGuideLine, ResearchGuideLineRequestDto, ResearchGuideLineResponseDto> service , ResearchGuideLineService researchGuideLineService) {
		super(service);		
		this.researchGuideLineService = researchGuideLineService;
	}

}
