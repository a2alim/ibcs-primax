package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalMarksConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalMarks;
import com.ibcs.idsdp.rpm.services.ResearcherProposalMarksService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalMarksRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalMarksResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ResearcherProposalMarksConstant.RESEARCHER_PROPOSAL_MARKS)
public class ResearcherProposalMarksController extends	BaseController<ResearcherProposalMarks, ResearcherProposalMarksRequestDto, ResearcherProposalMarksResponseDto>{

	private final ResearcherProposalMarksService service;

	public ResearcherProposalMarksController(
			BaseService<ResearcherProposalMarks, ResearcherProposalMarksRequestDto, ResearcherProposalMarksResponseDto> service, ResearcherProposalMarksService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = ResearcherProposalMarksConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalMarksResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return service.getByResearcherProposalId(researcherProposalId);
	}

	@PostMapping(path = ResearcherProposalMarksConstant.SAVE_LIST, produces = "application/json")
	public Response<ResearcherProposalMarksResponseDto> saveList(@RequestBody List<ResearcherProposalMarksRequestDto> requestDtoList) {
		return service.saveList(requestDtoList);
	}

}
