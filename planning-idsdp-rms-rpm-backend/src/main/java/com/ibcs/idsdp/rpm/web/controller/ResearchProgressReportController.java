package com.ibcs.idsdp.rpm.web.controller;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearchProgressReportConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearchProgressReport;
import com.ibcs.idsdp.rpm.services.ResearchProgressReportService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchProgressReportRequesteDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchProgressReportResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearchProgressReportConstant.RESEARCH_PROGRESS_REPORT)
public class ResearchProgressReportController extends BaseController<ResearchProgressReport, ResearchProgressReportRequesteDto, ResearchProgressReportResponseDto> {

	private final ResearchProgressReportService researchProgressReportService;

	public ResearchProgressReportController(BaseService<ResearchProgressReport, ResearchProgressReportRequesteDto, ResearchProgressReportResponseDto> service,
			ResearchProgressReportService researchProgressReportService) {
		super(service);
		this.researchProgressReportService = researchProgressReportService;
	}

	@PostMapping(value = ResearchProgressReportConstant.SAVE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearchProgressReportResponseDto> save(@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files){
		return researchProgressReportService.save(body, files);
	}

	@PostMapping(value = ResearchProgressReportConstant.UPDATE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearchProgressReportResponseDto> update(@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files){
		return researchProgressReportService.save(body, files);
	}

	@PostMapping(ResearchProgressReportConstant.GET_ALL)
	public Page<ResearchProgressReportResponseDto> getAllResearchProgressReport(@RequestBody ResearchProgressReportRequesteDto researchProgressReportRequesteDto){
		return researchProgressReportService.getAllResearchProgressReport(researchProgressReportRequesteDto);
	}
}
