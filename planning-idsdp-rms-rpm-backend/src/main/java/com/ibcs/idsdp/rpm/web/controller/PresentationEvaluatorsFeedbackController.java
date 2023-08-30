package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherFeedbackRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.PresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.domain.ViewPresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.repositories.PresentationEvaluatorsFeedbackRepository;
import com.ibcs.idsdp.rpm.services.PresentationEvaluatorsFeedbackService;
import com.ibcs.idsdp.rpm.web.dto.request.FeedbackListRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.PresentationEvaluatorsFeedbackRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FeedbackListResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationEvaluatorsFeedbackResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationReportResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchTittleResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;
import java.util.Optional;

@RestApiController
@RequestMapping("api/presentation-evaluators-feedback")
public class PresentationEvaluatorsFeedbackController extends
		BaseController<PresentationEvaluatorsFeedback, PresentationEvaluatorsFeedbackRequestDto, PresentationEvaluatorsFeedbackResponseDto> {

	private final PresentationEvaluatorsFeedbackService presentationEvaluatorsFeedbackService;
	private final PresentationEvaluatorsFeedbackRepository repository;

	public PresentationEvaluatorsFeedbackController(
			BaseService<PresentationEvaluatorsFeedback, PresentationEvaluatorsFeedbackRequestDto, PresentationEvaluatorsFeedbackResponseDto> service,
			PresentationEvaluatorsFeedbackService presentationEvaluatorsFeedbackService,
			PresentationEvaluatorsFeedbackRepository repository) {
		super(service);
		this.presentationEvaluatorsFeedbackService = presentationEvaluatorsFeedbackService;
		this.repository = repository;
	}

//	@Override
//	public Response update(PresentationEvaluatorsFeedbackRequestDto i) {
//		Optional<PresentationEvaluatorsFeedback> optional = repository.findByUuidAndIsDeleted(i.getUuid(), false);
//		if (optional.get().getFeedbackCompleted() != null && optional.get().getFeedbackCompleted() == true) {
//			return new Response<PresentationEvaluatorsFeedbackResponseDto>() {
//				{
//					setSuccess(false);
//					setMessage("Feedback Allready Completed !.");
//				}
//			};
//		}
//		
//		return super.update(i);
//	}

	@GetMapping(value = "/find-evaluator-by-seminar-id/{seminarId}", produces = "application/json")
	public Response<ViewPresentationEvaluatorsFeedback> findEvaluatorBySeminarId(
			@PathVariable("seminarId") Long seminarId) {
		return presentationEvaluatorsFeedbackService.findEvaluatorBySeminarId(seminarId);
	}

	@PostMapping(path = "/feedback-list-group-by-researcher-proposal", produces = "application/json")
	public Page<FeedbackListResponseDto> feedbackListGroupByResearcherProposal(
			@RequestBody FeedbackListRequestDto feedbackListRequestDto) {
		return presentationEvaluatorsFeedbackService.feedbackListGroupByResearcherProposal(feedbackListRequestDto);
	}

	@GetMapping(value = "/find-fiscal-year", produces = "application/json")
	public Response<FiscalResponseDto> findFiscalYear() {
		return presentationEvaluatorsFeedbackService.findFiscalYear();
	}

	@GetMapping(value = "/find-research-tittle/{fiscalYearId}", produces = "application/json")
	public Response<ResearchTittleResponseDto> findResearchTittle(@PathVariable("fiscalYearId") Long fiscalYearId) {
		return presentationEvaluatorsFeedbackService.findResearchTittle(fiscalYearId);
	}

	@GetMapping(value = "/find-researcher-name/{researcherProposalId}", produces = "application/json")
	public Response<ResearchTittleResponseDto> findResearcherName(
			@PathVariable("researcherProposalId") Long researcherProposalId) {
		return presentationEvaluatorsFeedbackService.findResearcherName(researcherProposalId);
	}

	@GetMapping(value = "/find-all-by-researcher-proposal/{uuid}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalId(
			@PathVariable("uuid") String uuid) {
		return presentationEvaluatorsFeedbackService.findAllByResearcherProposalId(uuid);
	}

	@GetMapping(value = "/find-all-new-feedback-by-researcher-proposal-uuid/{proposalUuid}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> getAllNewFeedbackByResearcherProposalUuid(
			@PathVariable("proposalUuid") String proposalUuid) {
		return presentationEvaluatorsFeedbackService.getAllNewFeedbackByResearcherProposalUuid(proposalUuid);
	}

	@GetMapping(value = "/get-by-researcher-presentation-id/{researcherPresentationId}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> getByResearcherPresentationId(
			@PathVariable("researcherPresentationId") Long researcherPresentationId) {
		return presentationEvaluatorsFeedbackService.getByResearcherPresentationId(researcherPresentationId);
	}

	@PostMapping(path = "/researcher-feedback", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> updateList(
			@RequestBody List<ResearcherFeedbackRequestDto> requestDto) {
		return presentationEvaluatorsFeedbackService.updateList(requestDto);
	}

	@GetMapping(value = "/find-all-by-researcher-proposal-for-feedback-list/{proposalUuid}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalUuid(
			@PathVariable("proposalUuid") String proposalUuid) {
		return presentationEvaluatorsFeedbackService.findAllByResearcherProposalUuid(proposalUuid);
	}

	@GetMapping(value = "/find-seminar-presentation-report-by-seminar-uuid/{createSeminarUuid}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> findSeminarPresentationReport(
			@PathVariable("createSeminarUuid") String createSeminarUuid) {
		return presentationEvaluatorsFeedbackService.findSeminarPresentationReport(createSeminarUuid);
	}

	@PostMapping(value = "/find-By-researcher-presentation-and-researcher-proposal-and-expert-evaluator-or-newmember", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> findByResearcherPresentationAndResearcherProposalAndExpertEvaluatorOrNewmember(
			@RequestBody PresentationEvaluatorsFeedbackRequestDto presentationEvaluatorsFeedbackRequestDto) {
		return presentationEvaluatorsFeedbackService
				.findByResearcherPresentationAndResearcherProposalAndExpertEvaluatorOrNewmember(
						presentationEvaluatorsFeedbackRequestDto);
	}

	@GetMapping(value = "/find-all-with-proposal-by-proposal-uuid/{proposalUuid}", produces = "application/json")
	public Response<PresentationEvaluatorsFeedbackResponseDto> findAllFeedbackWithProposalByProposalUuid(
			@PathVariable("proposalUuid") String proposalUuid) {
		return presentationEvaluatorsFeedbackService.findAllFeedbackWithProposalByProposalUuid(proposalUuid);
	}

}
