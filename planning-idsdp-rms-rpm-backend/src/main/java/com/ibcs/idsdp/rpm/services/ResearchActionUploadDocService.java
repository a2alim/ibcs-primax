package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearchActionUploadDocService {

	Response<ResearchActionUploadDocResponseDto> save(String body, Optional<MultipartFile[]> files,
			String updatedFileList);

	public Response<ResearchActionUploadDocResponseDto> findAllByTakeActionForResearchId(Long takeActionForResearchId);

}
