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
import com.ibcs.idsdp.rpm.constants.ResearcherProposalBudgetDetailsConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalBudgetDetails;
import com.ibcs.idsdp.rpm.services.ResearcherProposalBudgetDetailsService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalBudgetDetailsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalBudgetDetailsResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearcherProposalBudgetDetailsConstant.RESEARCHER_PROPOSAL_BUDGET_DETAILS)
public class ResearcherProposalBudgetDetailsController extends BaseController<ResearcherProposalBudgetDetails,ResearcherProposalBudgetDetailsRequestDto, ResearcherProposalBudgetDetailsResponseDto>{

	private final ResearcherProposalBudgetDetailsService service;

	public ResearcherProposalBudgetDetailsController(
			BaseService<ResearcherProposalBudgetDetails, ResearcherProposalBudgetDetailsRequestDto, ResearcherProposalBudgetDetailsResponseDto> service, ResearcherProposalBudgetDetailsService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalBudgetDetailsConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalBudgetDetailsResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

	@PostMapping(path = ResearcherProposalBudgetDetailsConstant.SAVE_LIST, produces = "application/json")
	public Response<ResearcherProposalBudgetDetailsResponseDto> getByResearcherProposalId(@RequestBody List<ResearcherProposalBudgetDetailsRequestDto> requestDtoList) {
		return service.saveList(requestDtoList);
	}

}
