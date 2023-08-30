package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.services.GoLetterService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.GoLetterRequstDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("/create-go-letter")
public class GoLetterController extends BaseController<GoLetter, GoLetterRequstDto, GoLetterResponseDto> {

	private final GoLetterService goLetterService;

	public GoLetterController(BaseService<GoLetter, GoLetterRequstDto, GoLetterResponseDto> service,GoLetterService goLetterService) {
		super(service);
		this.goLetterService = goLetterService;
	}

	@GetMapping(value = "/find-by-uuid/{uuid}")
	public Response<GoLetterResponseDto> findByUuid(@PathVariable("uuid") String uuid) {
		return goLetterService.findByUuid(uuid);
	}

}
