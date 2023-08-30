package com.ibcs.idsdp.rpm.services;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.rpm.web.dto.request.ResearchProgressReportRequesteDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchProgressReportResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ResearchProgressReportService {

	public Response<ResearchProgressReportResponseDto> save(String body, Optional<MultipartFile[]> files);

	Page<ResearchProgressReportResponseDto> getAllResearchProgressReport(ResearchProgressReportRequesteDto researchProgressReportRequesteDto);
}
