package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.EligibilityCheckerRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EligibilityCheckerResponseDto;
import com.ibcs.idsdp.util.Response;

public interface EligibilityCheckerService {
	
	public Response<EligibilityCheckerResponseDto> createEligibilityChecker(EligibilityCheckerRequestDto eligibilityCheckerRequestDto);

}
