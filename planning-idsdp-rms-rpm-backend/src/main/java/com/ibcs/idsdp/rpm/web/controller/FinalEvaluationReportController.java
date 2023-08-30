package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.FinalEvaluationReportConst;
import com.ibcs.idsdp.rpm.model.domain.FinalEvaluationReport;
import com.ibcs.idsdp.rpm.services.FinalEvaluationReportService;
import com.ibcs.idsdp.rpm.web.dto.request.FinalEvaluationReportRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FinalEvaluationReportResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(FinalEvaluationReportConst.FINAL_EVALUATION_REPORT)
public class FinalEvaluationReportController extends BaseController<FinalEvaluationReport, FinalEvaluationReportRequestDto, FinalEvaluationReportResponseDto> {

	final private FinalEvaluationReportService finalEvaluationReportService;

	public FinalEvaluationReportController(BaseService<FinalEvaluationReport, FinalEvaluationReportRequestDto, FinalEvaluationReportResponseDto> service, FinalEvaluationReportService finalEvaluationReportService) {
		super(service);
		this.finalEvaluationReportService = finalEvaluationReportService;
	}

	@PostMapping(path = FinalEvaluationReportConst.CREATE_OR_UPDATE, produces = "application/json")
	public Response<FinalEvaluationReportResponseDto> createOrUpdate(@RequestBody FinalEvaluationReportRequestDto finalEvaluationReportRequestDto ){
		return finalEvaluationReportService.createOrUpdate(finalEvaluationReportRequestDto);
	}

	@GetMapping(path = FinalEvaluationReportConst.FIND_ALL, produces = "application/json")
	public Response<FinalEvaluationReport> findAllByActive() {
		return finalEvaluationReportService.findAll(false,true);
	}

}
