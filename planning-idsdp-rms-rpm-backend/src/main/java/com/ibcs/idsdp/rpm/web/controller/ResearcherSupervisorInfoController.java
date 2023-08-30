package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.services.ResearcherSupervisorInfoService;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherSupervisorInfoConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherSupervisorInfo;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherSupervisorInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherSupervisorInfoResponseDto;

@RestApiController
@RequestMapping(ResearcherSupervisorInfoConstant.RESEARCHER_SUPERVISOR_INFO)
public class ResearcherSupervisorInfoController extends	BaseController<ResearcherSupervisorInfo, ResearcherSupervisorInfoRequestDto, ResearcherSupervisorInfoResponseDto> {

	private final ResearcherSupervisorInfoService service;

	public ResearcherSupervisorInfoController(
			BaseService<ResearcherSupervisorInfo, ResearcherSupervisorInfoRequestDto, ResearcherSupervisorInfoResponseDto> service, ResearcherSupervisorInfoService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherSupervisorInfoConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherSupervisorInfoResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

}
