package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalMarksRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalMarksResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

public interface ResearcherProposalMarksService {

    Response<ResearcherProposalMarksResponseDto> getByResearcherProposalId(Long id);

    Response<ResearcherProposalMarksResponseDto> saveList(List<ResearcherProposalMarksRequestDto> request);

}
