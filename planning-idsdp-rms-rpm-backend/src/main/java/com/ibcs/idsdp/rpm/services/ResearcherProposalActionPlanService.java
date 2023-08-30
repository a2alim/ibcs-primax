package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalActionPlan;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalActionPlanResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

public interface ResearcherProposalActionPlanService {

    public Response<ResearcherProposalActionPlanResponseDto> getByResearcherProposalId(Long id);

    public Response<ResearcherProposalActionPlanResponseDto> saveList(List<ResearcherProposalActionPlanRequestDto> request);

    public Response<ResearcherProposalActionPlanResponseDto>  saveList2(List<ResearcherProposalActionPlanRequestDto> actionPlans);

}
