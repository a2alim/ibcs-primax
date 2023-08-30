package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.ResearchFinalSubmissionResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearchFinalSubmissionService {

    Response<ResearchFinalSubmissionResponseDto> findByM1ResearcherProposalId(Long m1ResearcherProposalId);

    Response submitFinalCompletionReport (Long id);

}
