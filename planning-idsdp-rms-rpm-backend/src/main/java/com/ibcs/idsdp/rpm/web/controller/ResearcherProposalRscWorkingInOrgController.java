package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalRscWorkingInOrgConstants;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalRscWorkingInOrg;
import com.ibcs.idsdp.rpm.services.ResearcherProposalRscWorkingInOrgService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearcherProposalRscWorkingInOrgConstants.RESEARCHER_PROPOSAL_RSC_WORKINGIN_ORG)
public class ResearcherProposalRscWorkingInOrgController extends BaseController<ResearcherProposalRscWorkingInOrg, ResearcherProposalRscWorkingInOrgRequestDto, ResearcherProposalRscWorkingInOrgResponseDto> {

	private final ResearcherProposalRscWorkingInOrgService researcherProposalRscWorkingInOrgService;
	
	public ResearcherProposalRscWorkingInOrgController(
			BaseService<ResearcherProposalRscWorkingInOrg, ResearcherProposalRscWorkingInOrgRequestDto, ResearcherProposalRscWorkingInOrgResponseDto> service, ResearcherProposalRscWorkingInOrgService researcherProposalRscWorkingInOrgService) {
		super(service);	
		this.researcherProposalRscWorkingInOrgService = researcherProposalRscWorkingInOrgService;
	}
	
	
	@GetMapping(path = ResearcherProposalRscWorkingInOrgConstants.GET_LIST_FIND_BY_RESEARCHER_PROPOSAL_ID, produces = "application/json")
	public Response<ResearcherProposalRscWorkingInOrgResponseDto> getListFindByResearcherProposalId(@PathVariable("researcherProposalId") Long researcherProposalId) {
		return researcherProposalRscWorkingInOrgService.getListFindByResearcherProposalId(researcherProposalId);
	}


	@PostMapping(path = ResearcherProposalRscWorkingInOrgConstants.SAVE_LIST, produces = "application/json")
	public Response<ResearcherProposalRscWorkingInOrgResponseDto> createList(@RequestBody List<ResearcherProposalRscWorkingInOrgRequestDto> researcherProposalRscWorkingInOrgRequestDtoList) {
		return researcherProposalRscWorkingInOrgService.createList(researcherProposalRscWorkingInOrgRequestDtoList);
	}
	
	
	

}
