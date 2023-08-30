package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalBudgetDetailsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalBudgetDetailsResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

public interface ResearcherProposalBudgetDetailsService {

    public Response<ResearcherProposalBudgetDetailsResponseDto> getByResearcherProposalId(Long id);

    public Response<ResearcherProposalBudgetDetailsResponseDto> saveList(List<ResearcherProposalBudgetDetailsRequestDto> request);


}
