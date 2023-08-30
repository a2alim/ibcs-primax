package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.response.ResearcherSupervisorInfoResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherSupervisorInfoService {

    public Response<ResearcherSupervisorInfoResponseDto> getByResearcherProposalId(Long id);

}
