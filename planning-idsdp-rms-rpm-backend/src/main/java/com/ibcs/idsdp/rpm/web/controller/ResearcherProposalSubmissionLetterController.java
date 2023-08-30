package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalSubmissionLetterConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalSubmissionLetter;
import com.ibcs.idsdp.rpm.services.ResearcherProposalSubmissionLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalSubmissionLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalSubmissionLetterResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(ResearcherProposalSubmissionLetterConstant.RESEARCHER_PROPOSAL_SUBMISSION_LETTER)
public class ResearcherProposalSubmissionLetterController extends BaseController<ResearcherProposalSubmissionLetter, ResearcherProposalSubmissionLetterRequestDto,ResearcherProposalSubmissionLetterResponseDto>{

	private final ResearcherProposalSubmissionLetterService service;

	public ResearcherProposalSubmissionLetterController(
			BaseService<ResearcherProposalSubmissionLetter, ResearcherProposalSubmissionLetterRequestDto, ResearcherProposalSubmissionLetterResponseDto> service, ResearcherProposalSubmissionLetterService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalSubmissionLetterConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalSubmissionLetterResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

}
