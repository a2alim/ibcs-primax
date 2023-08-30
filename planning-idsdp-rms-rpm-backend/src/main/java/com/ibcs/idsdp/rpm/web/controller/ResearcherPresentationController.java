package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.services.ResearcherPresentationService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherPresentationRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherPresentationResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/researcher-presentation")
public class ResearcherPresentationController extends	BaseController<ResearcherPresentation, ResearcherPresentationRequestDto, ResearcherPresentationResponseDto> {

	private final ResearcherPresentationService researcherPresentationService;

	public ResearcherPresentationController(
			BaseService<ResearcherPresentation, ResearcherPresentationRequestDto, ResearcherPresentationResponseDto> service,
			ResearcherPresentationService researcherPresentationService) {
		super(service);
		this.researcherPresentationService = researcherPresentationService;
	}

	@GetMapping(value = "/research-tittle-list/{createSeminarUuid}", produces = "application/json")
	public Response<CreateSeminarTimeScheduleResponseDto> getResearchTittleListFindBySeminarId(@PathVariable("createSeminarUuid") String createSeminarUuid) {
		
		return researcherPresentationService.getResearchTittleListFindBySeminarId(createSeminarUuid);
	}
	
	@GetMapping(value = "/find-by-researcher-proposal-id/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherPresentationResponseDto> findByResearcherProposalId(@PathVariable("researcherProposalId") Long researcherProposalId) {		
		return researcherPresentationService.findByResearcherProposalId(researcherProposalId);
	}

	@GetMapping(value = "/get-by-seminar-id/{createSeminarUuid}", produces = "application/json")
	public Response<ResearcherPresentationResponseDto> getResearchPresentationBySeminarUuid(@PathVariable("createSeminarUuid") String createSeminarUuid) {
		return researcherPresentationService.getResearchPresentationBySeminarUuid(createSeminarUuid);
	}

}
