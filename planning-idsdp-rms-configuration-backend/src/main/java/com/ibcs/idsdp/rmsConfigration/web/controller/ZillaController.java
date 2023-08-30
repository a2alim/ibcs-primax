package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.ZillaConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.Zilla;
import com.ibcs.idsdp.rmsConfigration.services.ZillaService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ZillaRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ZillaResponse;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ZillaConstant.ZILLA)
public class ZillaController extends BaseController<Zilla, ZillaRequest, ZillaResponse> {

	private final ZillaService zillaService;

	public ZillaController(BaseService<Zilla, ZillaRequest, ZillaResponse> baseService, ZillaService zillaService) {
		super(baseService);
		this.zillaService = zillaService;
	}

	@GetMapping(value = "find-by-division-id/{divisionId}", produces = "application/json")
	Response<ZillaResponse> findByDivision(@PathVariable("divisionId") Long divisionId) {
		return zillaService.findByDivision(divisionId);
	}

}
