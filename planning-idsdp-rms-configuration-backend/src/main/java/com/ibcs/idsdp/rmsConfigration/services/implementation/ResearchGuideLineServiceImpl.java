package com.ibcs.idsdp.rmsConfigration.services.implementation;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.ResearchGuideLine;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ResearchGuideLineRepository;
import com.ibcs.idsdp.rmsConfigration.services.ResearchGuideLineService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ResearchGuideLineRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ResearchGuideLineResponseDto;

@Service
public class ResearchGuideLineServiceImpl extends BaseService<ResearchGuideLine, ResearchGuideLineRequestDto, ResearchGuideLineResponseDto> implements ResearchGuideLineService{
	
	private final ResearchGuideLineRepository researchGuideLineRepository;

	protected ResearchGuideLineServiceImpl(ServiceRepository<ResearchGuideLine> repository , ResearchGuideLineRepository researchGuideLineRepository) {
		super(repository);	
		this.researchGuideLineRepository = researchGuideLineRepository;
	}

}
