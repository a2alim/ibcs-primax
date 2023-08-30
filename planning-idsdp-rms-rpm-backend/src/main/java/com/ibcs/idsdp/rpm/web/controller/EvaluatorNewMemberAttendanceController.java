package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.EvaluatorNewMemberAttendance;
import com.ibcs.idsdp.rpm.services.EvaluatorNewMemberAttendanceService;
import com.ibcs.idsdp.rpm.web.dto.request.EvaluatorNewMemberAttendanceRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EvaluatorNewMemberAttendanceResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/evaluator-newmember-attendance")
public class EvaluatorNewMemberAttendanceController extends	BaseController<EvaluatorNewMemberAttendance, EvaluatorNewMemberAttendanceRequestDto, EvaluatorNewMemberAttendanceResponseDto> {

	private final EvaluatorNewMemberAttendanceService evaluatorNewMemberAttendanceService;

	public EvaluatorNewMemberAttendanceController(
			BaseService<EvaluatorNewMemberAttendance,
			EvaluatorNewMemberAttendanceRequestDto,
			EvaluatorNewMemberAttendanceResponseDto> service,
			
			EvaluatorNewMemberAttendanceService evaluatorNewMemberAttendanceService) {
		super(service);
		this.evaluatorNewMemberAttendanceService = evaluatorNewMemberAttendanceService;
	}

	@GetMapping(value = "/find-all-by-researcher-proposal/{uuid}", produces = "application/json")
	public Response<EvaluatorNewMemberAttendanceResponseDto> findAllByResearcherProposalId(@PathVariable("uuid") String uuid) {
		return evaluatorNewMemberAttendanceService.findAllByResearcherProposalId(uuid);
	}

	@GetMapping(value = "/get-by-researcher-presentation-id/{researcherPresentationId}", produces = "application/json")
	public Response<EvaluatorNewMemberAttendanceResponseDto> getByResearcherPresentationId(@PathVariable("researcherPresentationId") Long researcherPresentationId) {
		return evaluatorNewMemberAttendanceService.getByResearcherPresentationId(researcherPresentationId);
	}

}
