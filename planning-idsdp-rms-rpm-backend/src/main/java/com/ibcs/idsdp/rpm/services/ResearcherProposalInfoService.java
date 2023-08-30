package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInfo;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInfoResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalInfoService {

    public Response<ResearcherProposalInfoResponseDto> getByResearcherProposalId(Long id);
    
    public ResearcherProposalInfo getResearcherProposalInfoById(Long id);

}
