package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.services.CreateSeminarTimeScheduleService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarTimeScheduleRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarTimeScheduleResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/seminar-time-schedule")
public class CreateSeminarTimeScheduleController extends BaseController<CreateSeminarTimeSchedule, CreateSeminarTimeScheduleRequestDto, CreateSeminarTimeScheduleResponseDto> {

	private final CreateSeminarTimeScheduleService createSeminarTimeScheduleService;

	public CreateSeminarTimeScheduleController(
			BaseService<CreateSeminarTimeSchedule, CreateSeminarTimeScheduleRequestDto, CreateSeminarTimeScheduleResponseDto> service,
			CreateSeminarTimeScheduleService createSeminarTimeScheduleService) {
		super(service);
		this.createSeminarTimeScheduleService = createSeminarTimeScheduleService;
	}

	// for saving arrayList
	@PostMapping(path = "/create-list", produces = "application/json")
	public ResponseEntity<Object> saveAgreementInstallment(@RequestBody List<CreateSeminarTimeScheduleRequestDto> requestDto) {
		Response<CreateSeminarTimeSchedule> res = createSeminarTimeScheduleService.doSave(requestDto);
		return new ResponseEntity<>(res, HttpStatus.CREATED);
	}

	// for update arrayList
	@PutMapping(path = "/update-list", produces = "application/json")
	public ResponseEntity<Object> updateAgreementInstallment(@RequestBody List<CreateSeminarTimeScheduleRequestDto> requestDto) {
		Response<CreateSeminarTimeSchedule> res = createSeminarTimeScheduleService.doUpdate(requestDto);
		System.out.println();
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@GetMapping(path = "/seminar-is-exists/{seminarId}", produces = "application/json")
	public Boolean seminarIsExists(@PathVariable("seminarId") Long seminarId) {
		return createSeminarTimeScheduleService.seminarIsExists(seminarId);
	}
	
	@GetMapping(path = "/find-all-by-seminar-id/{seminarId}", produces = "application/json")
	public Response<CreateSeminarTimeScheduleResponseDto> findAllBySeminarId(@PathVariable("seminarId") Long seminarId) {
		return createSeminarTimeScheduleService.findAllBySeminarId(seminarId);
	}

}
