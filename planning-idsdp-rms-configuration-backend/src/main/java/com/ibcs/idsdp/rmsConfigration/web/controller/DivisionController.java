package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.DivisionConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.Division;
import com.ibcs.idsdp.rmsConfigration.services.DivisionService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.DivisionResponse;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(DivisionConstant.DIVISION)
public class DivisionController extends BaseController<Division, DivisionRequest, DivisionResponse> {

	private final DivisionService divisionService;

	public DivisionController(BaseService<Division, DivisionRequest, DivisionResponse> baseService,	DivisionService divisionService) {
		super(baseService);
		this.divisionService = divisionService;
	}

	@GetMapping(DivisionConstant.GET_ACTIVE_DIVISION)
	public Response<DivisionResponse> getActiveDivision() {
		return divisionService.getActiveDivision();
	}

}
