package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearchActionConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearchAction;
import com.ibcs.idsdp.rpm.services.ResearchActionService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchActionRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearchActionConstant.RESEARCH_ACTION)
public class ResearchActionController extends BaseController<ResearchAction, ResearchActionRequestDto, ResearchActionResponseDto>{

	final private ResearchActionService researchActionService;

	public ResearchActionController(BaseService<ResearchAction, ResearchActionRequestDto, ResearchActionResponseDto> service,
			ResearchActionService researchActionService) {
		super(service);
		this.researchActionService = researchActionService;
	}

	@PostMapping(ResearchActionConstant.SAVE)
	public Response<ResearchActionResponseDto> save(@RequestBody ResearchActionRequestDto researchActionRequestDto) {
		return researchActionService.save(researchActionRequestDto);
	}

	@PutMapping(ResearchActionConstant.UPDATE)
	public Response<ResearchActionResponseDto> update(@RequestBody ResearchActionRequestDto researchActionRequestDto) {
		return researchActionService.save(researchActionRequestDto);
	}

	@PostMapping(ResearchActionConstant.GET_ALL)
	public Page<ResearchActionResponseDto> getAll(@RequestBody ResearchActionRequestDto researchActionRequestDto){
		return researchActionService.getAllResearchAction(researchActionRequestDto);
	}
}
