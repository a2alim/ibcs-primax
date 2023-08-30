package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.FeedbackBetweenEvaAndResearcher;
import com.ibcs.idsdp.rpm.services.FeedbackBetweenEvaAndResearcherService;
import com.ibcs.idsdp.rpm.web.dto.request.FeedbackBetweenEvaAndResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FeedbackBetweenEvaAndResearcherResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/feedback-between-eva-and-researcher")
public class FeedbackBetweenEvaAndResearcherController extends BaseController<FeedbackBetweenEvaAndResearcher, FeedbackBetweenEvaAndResearcherRequestDto, FeedbackBetweenEvaAndResearcherResponseDto> {
	
	private final FeedbackBetweenEvaAndResearcherService feedbackBetweenEvaAndResearcherService;

	public FeedbackBetweenEvaAndResearcherController(BaseService<FeedbackBetweenEvaAndResearcher, FeedbackBetweenEvaAndResearcherRequestDto, FeedbackBetweenEvaAndResearcherResponseDto> service , FeedbackBetweenEvaAndResearcherService feedbackBetweenEvaAndResearcherService) {
		super(service);
		this.feedbackBetweenEvaAndResearcherService = feedbackBetweenEvaAndResearcherService;
	}	
	
	@GetMapping(path = "/find-user-by-user-id/{userId}", produces = "application/json")
	public Response<UserResponse> findUserByUserId(@PathVariable("userId") Long userId){
	 return feedbackBetweenEvaAndResearcherService.findUserByUserId(userId);
	}
	
	
	@GetMapping(path = "/find-evaluator-by-seminar-id/{seminarId}", produces = "application/json")
	public Response<ExpertEvaluatorResponseDto> findEvaluatorBySeminarId(@PathVariable("seminarId") Long seminarId){
	 return feedbackBetweenEvaAndResearcherService.findEvaluatorBySeminarId(seminarId);
	}
	
	
	@GetMapping(path = "/find-evaluator-by-researcher-proposal-id/{researcherProposalId}", produces = "application/json")
	public Response<ExpertEvaluatorResponseDto> findEvaluatorByResearcherProposal(@PathVariable("researcherProposalId") Long researcherProposalId){
	 return feedbackBetweenEvaAndResearcherService.findEvaluatorByResearcherProposal(researcherProposalId);
	}
	
	
	
	
	

}
