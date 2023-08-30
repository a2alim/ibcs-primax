package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInstituteInfoResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalInstituteInfoService {

	Response<ResearcherProposalInstituteInfoResponseDto> findByResearcherProposalId(Long researcherProposalId);

	Response<ResearcherProposalInstituteInfoResponseDto> updateResearcherProposalInstituteInfo(String data,
			Optional<MultipartFile> file);

	Response<ResearcherProposalInstituteInfoResponseDto> createResearcherProposalInstituteInfo(String data,
			Optional<MultipartFile> file);

}
