package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.PresentationReport;
import com.ibcs.idsdp.rpm.services.PresentationReportService;
import com.ibcs.idsdp.rpm.web.dto.request.PresentationReportRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationReportResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/presentation-report")
public class PresentationReportController extends BaseController<PresentationReport, PresentationReportRequestDto, PresentationReportResponseDto>{

	
	public final PresentationReportService presentationReportService;
	
	public PresentationReportController(
			BaseService<PresentationReport, PresentationReportRequestDto, PresentationReportResponseDto> service , PresentationReportService presentationReportService) {
		super(service);	
		this.presentationReportService = presentationReportService;
	}		
	
	@GetMapping(value = "/find-all-by-create-seminar-uuid/{createSeminarUuid}", produces = "application/json")
	public Response<PresentationReportResponseDto> findByCreateSeminarUuid(@PathVariable("createSeminarUuid") String createSeminarUuid) {		
		return presentationReportService.findByCreateSeminarUuid(createSeminarUuid);
	}
	
	@GetMapping(path = "/seminar-is-exists/{seminarId}", produces = "application/json")
	public Boolean seminarIsExists(@PathVariable("seminarId") Long seminarId) {
		return presentationReportService.seminarIsExists(seminarId);
	}
	

}
