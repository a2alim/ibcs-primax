package com.ibcs.idsdp.rpm.services;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalDetailsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalService {

	Response<ResearcherProposalResponseDto> findAllByStFiscalYearId(ResearcherProposalRequestDto researcherProposalRequestDto);
	Response<ResearcherProposalDetailsResponseDto> getResearcherProposalDetailsByUuid(String researcherProposalUuid);
	Response<ResearcherProposalDetailsResponseDto> getListFindByResProfilePersonalInfoId(PageableRequestBodyDTO requestBodyDTO, Long resProfilePersonalInfoId);	
	Response<ResearcherProposalResponseDto> getListFindByResProfilePersonalInfoId(Long resProfilePersonalInfoId);
	Response<ResearcherProposalResponseDto> getResearcherProfileByFiscalYear(Long fiscalYearId);
	Response<ResearcherProposalResponseDto> updateApprovalStatus(ResearcherProposalRequestDto researcherProposalRequestDto);
	Response<ResearcherProposalResponseDto> updateFinalSubmitStatus(ResearcherProposalRequestDto researcherProposalRequestDto);	
	Response<ResearcherProposalResponseDto> getAllResearcherProposal();
	Response<List<ResearcherProposalResponseDto>> getResearcherProposalsByUserid(Long id);
	ResearcherProposal findById(Long id);
	Response<ResearcherProposalResponseDto> getResearchInformation(String uuid);

	Response<ResearcherProposalResponseDto> getProposalByProfileUuid(String uuid);

    Response<ResearcherProposalResponseDto> getProposalListByFinalSubmit(Boolean byFinalSubmit);

	/*
	 * Added BY Rakib
	 * */
	Response<ResearcherProposalResponseDto> getProposalResponse(String uuid);

	Response<ResearcherProposalResponseDto> getListByFiscalYearIdResearchCatId(Long stFiscalYearId, Long stResearchCatId);
}
