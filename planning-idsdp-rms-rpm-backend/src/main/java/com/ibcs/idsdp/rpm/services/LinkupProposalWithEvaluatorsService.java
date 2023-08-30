package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.LinkupProposalWithEvaluatorsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.util.Response;

public interface LinkupProposalWithEvaluatorsService {

	Response<LinkupProposalWithEvaluatorsResponseDto> saveLinkupProposalWithEvaluators(LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto);
	Response<LinkupProposalWithEvaluatorsResponseDto> findByResearcherProposal(Long researcherProposalId);

}
