package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfileRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 */
public interface ResearcherProfileRscWorkingInOrgService {
	
	Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByResearcherProfileId(Long researcherProposalId);
	Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByUserId(Long researcherProposalId);
	Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(List<ResearcherProfileRscWorkingInOrgRequestDto> researcherProposalRscWorkingInOrgRequestDtoList);
	Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(String body, Optional<MultipartFile[]> files,String updatedFileList);

}
