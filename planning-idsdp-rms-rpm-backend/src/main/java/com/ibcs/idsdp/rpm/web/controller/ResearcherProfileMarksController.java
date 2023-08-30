package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProfileMarksConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileMarks;
import com.ibcs.idsdp.rpm.services.ResearcherProfileMarksService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfileMarksRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileMarksResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ResearcherProfileMarksConstant.RESEARCHER_PROFILE_MARKS)
public class ResearcherProfileMarksController extends BaseController<ResearcherProfileMarks, ResearcherProfileMarksRequestDto, ResearcherProfileMarksResponseDto>{

	private final ResearcherProfileMarksService service;

	public ResearcherProfileMarksController(BaseService<ResearcherProfileMarks, ResearcherProfileMarksRequestDto, ResearcherProfileMarksResponseDto> service, ResearcherProfileMarksService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProfileMarksConstant.GET_BY_RESEARCHER_PROPOSAL_ID_AND_CATEGORY_ID + "/{researcherProposalId}/{categoryId}", produces = "application/json")
	public Response<ResearcherProfileMarksResponseDto> getByResearcherProposalIdAndCategory(@PathVariable Long researcherProposalId, @PathVariable Long categoryId) {
		return service.getByResearcherProposalIdAndCategory(researcherProposalId, categoryId);
	}

}
