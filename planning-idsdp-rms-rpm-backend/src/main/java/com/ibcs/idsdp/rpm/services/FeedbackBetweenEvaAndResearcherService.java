package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.util.Response;

public interface FeedbackBetweenEvaAndResearcherService {

	Response<UserResponse> findUserByUserId(Long userId);
	Response<ExpertEvaluatorResponseDto> findEvaluatorBySeminarId(Long seminarId);
	Response<ExpertEvaluatorResponseDto> findEvaluatorByResearcherProposal(Long researcherProposalId);
	
	

}
