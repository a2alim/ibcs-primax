package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.services.EligibilityCheckerService;
import com.ibcs.idsdp.rpm.web.dto.request.EligibilityCheckerRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EligibilityCheckerResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/eligibility-checker")
public class EligibilityCheckerController {

	private final EligibilityCheckerService eligibilityCheckerService;

	EligibilityCheckerController(EligibilityCheckerService eligibilityCheckerService) {
		this.eligibilityCheckerService = eligibilityCheckerService;
	}

	@PostMapping(path = "/create-eligibility-checker", produces = "application/json")
	public Response<EligibilityCheckerResponseDto> createEligibilityChecker(@RequestBody EligibilityCheckerRequestDto eligibilityCheckerRequestDto) {
		return eligibilityCheckerService.createEligibilityChecker(eligibilityCheckerRequestDto);
	}

}
