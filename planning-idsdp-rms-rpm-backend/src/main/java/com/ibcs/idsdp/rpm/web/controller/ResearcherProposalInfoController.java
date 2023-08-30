package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalInfoConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInfo;
import com.ibcs.idsdp.rpm.services.ResearcherProposalInfoService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInfoResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ResearcherProposalInfoConstant.RESEARCHER_PROPOSAL_INFO)
public class ResearcherProposalInfoController extends BaseController<ResearcherProposalInfo, ResearcherProposalInfoRequestDto,ResearcherProposalInfoResponseDto>{

	private final ResearcherProposalInfoService service;

	public ResearcherProposalInfoController(
			BaseService<ResearcherProposalInfo, ResearcherProposalInfoRequestDto, ResearcherProposalInfoResponseDto> service, ResearcherProposalInfoService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalInfoConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalInfoResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

}
