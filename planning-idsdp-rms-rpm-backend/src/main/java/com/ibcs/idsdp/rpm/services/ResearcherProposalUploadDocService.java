package com.ibcs.idsdp.rpm.services;

import java.util.List;
import java.util.Optional;

import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalUploadDocRequestDto;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearcherProposalUploadDocService {

	Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalId(Long researcherProposalId);

	Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalUuid(String researcherProposalUuid);

//	Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(String body, Optional<MultipartFile[]> files,String updatedFileList);
	Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(List<ResearcherProposalUploadDocRequestDto> requestDtoList);

	Response<ResearcherProposalUploadDocResponseDto> uploadProposalDocFromPresentation(String data, Optional<MultipartFile> file);


}
