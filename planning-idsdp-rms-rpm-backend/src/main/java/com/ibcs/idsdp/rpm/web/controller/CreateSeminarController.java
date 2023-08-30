package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.services.CreateSeminarService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/create-seminar")
public class CreateSeminarController extends BaseController<CreateSeminar, CreateSeminarRequestDto, CreateSeminarResponseDto> {

	final private CreateSeminarService createSeminarService;

	public CreateSeminarController(BaseService<CreateSeminar, CreateSeminarRequestDto, CreateSeminarResponseDto> service,CreateSeminarService createSeminarService) {
		super(service);
		this.createSeminarService = createSeminarService;
	}

	@GetMapping(path = "/view-details/{uuId}", produces = "application/json")
	public Response<Map<String, Object>> getSeminarView(@PathVariable("uuId") String uuId) {
		return null;
	}

	@GetMapping(path = "/view-details/{id}/update", produces = "application/json")
	public Response<Map<String, Object>> getSeminarView(@PathVariable("id") Long id) {
		return createSeminarService.getSeminarView(id);
	}
	
	
	@GetMapping(path = "/view/{seminarId}", produces = "application/json")
	public Response<Map<String, Object>> seminarDetailsFindBySeminarId(@PathVariable("seminarId") Long seminarId) {
		return createSeminarService.seminarDetailsFindBySeminarId(seminarId);
	}
	
	
}
