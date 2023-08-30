package com.ibcs.idsdp.rpm.services;

import java.util.List;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalRscWorkingInOrg;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalRscWorkingInOrgService {

	Response<ResearcherProposalRscWorkingInOrgResponseDto> getListFindByResearcherProposalId(Long researcherProposalId);

	Response<ResearcherProposalRscWorkingInOrgResponseDto> createList(
	List<ResearcherProposalRscWorkingInOrgRequestDto> researcherProposalRscWorkingInOrgRequestDtoList);

}
