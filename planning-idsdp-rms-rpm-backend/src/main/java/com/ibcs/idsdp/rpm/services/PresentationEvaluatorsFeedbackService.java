package com.ibcs.idsdp.rpm.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.PresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.model.domain.ViewPresentationEvaluatorsFeedback;
import com.ibcs.idsdp.rpm.web.dto.request.FeedbackListRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.PresentationEvaluatorsFeedbackRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherFeedbackRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FeedbackListResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationEvaluatorsFeedbackResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchTittleResponseDto;
import com.ibcs.idsdp.util.Response;

public interface PresentationEvaluatorsFeedbackService {

	Page<FeedbackListResponseDto> feedbackListGroupByResearcherProposal(FeedbackListRequestDto feedbackListRequestDto);

	Response<FiscalResponseDto> findFiscalYear();

	Response<ResearchTittleResponseDto> findResearchTittle(Long fiscalYearId);

	Response<ResearchTittleResponseDto> findResearcherName(Long researcherProposalId);

	Response<ViewPresentationEvaluatorsFeedback> findEvaluatorBySeminarId(Long seminarId);

	Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalId(String uuid);

	Response<PresentationEvaluatorsFeedbackResponseDto> getByResearcherPresentationId(Long presentationId);

	Response<PresentationEvaluatorsFeedbackResponseDto> getAllNewFeedbackByResearcherProposalUuid(String uuid);

	Response<PresentationEvaluatorsFeedbackResponseDto> updateList(List<ResearcherFeedbackRequestDto> requestDto);

	Response<PresentationEvaluatorsFeedbackResponseDto> findAllByResearcherProposalUuid(String proposalUuid);
	
	Response<PresentationEvaluatorsFeedbackResponseDto> findSeminarPresentationReport(String createSeminarUuid);
	
	Response<PresentationEvaluatorsFeedbackResponseDto> findByResearcherPresentationAndResearcherProposalAndExpertEvaluatorOrNewmember (PresentationEvaluatorsFeedbackRequestDto presentationEvaluatorsFeedbackRequestDto);

	Response<PresentationEvaluatorsFeedbackResponseDto> findAllFeedbackWithProposalByProposalUuid(String proposalUuid);

}
