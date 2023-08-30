package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.UpaZillaConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.UpaZilla;
import com.ibcs.idsdp.rmsConfigration.services.UpaZillaService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ZillaResponse;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(UpaZillaConstant.UPAZILLA)
public class UpaZillaController extends BaseController<UpaZilla, UpaZillaRequest, UpaZillaResponse> {

	private final UpaZillaService upaZillaService;

	public UpaZillaController(BaseService<UpaZilla, UpaZillaRequest, UpaZillaResponse> baseService,
			UpaZillaService upaZillaService) {
		super(baseService);
		this.upaZillaService = upaZillaService;
	}

	@GetMapping(value = "find-by-zilla-id/{zillaId}", produces = "application/json")
	Response<UpaZillaResponse> findByZilla(@PathVariable("zillaId") Long zillaId) {
		return upaZillaService.findByZilla(zillaId);
	}

}
