package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalSubmissionLetterResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalSubmissionLetterService {

    Response<ResearcherProposalSubmissionLetterResponseDto> getByResearcherProposalId(Long id);

}
