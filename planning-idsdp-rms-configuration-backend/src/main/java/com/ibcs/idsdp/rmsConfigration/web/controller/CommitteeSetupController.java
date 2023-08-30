package com.ibcs.idsdp.rmsConfigration.web.controller;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.CommitteeSetupConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;
import com.ibcs.idsdp.rmsConfigration.services.CommitteeSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeSetupResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(CommitteeSetupConstant.COMMITTEE_SETUP)
public class CommitteeSetupController
		extends BaseController<CommitteeSetup, CommitteeSetupRequestDto, CommitteeSetupResponseDto> {

	private final CommitteeSetupService committeeSetupService1;

	public CommitteeSetupController(
			BaseService<CommitteeSetup, CommitteeSetupRequestDto, CommitteeSetupResponseDto> service,
			CommitteeSetupService committeeSetupService) {
		super(service);
		this.committeeSetupService1 = committeeSetupService;
	}

	@PostMapping(path = CommitteeSetupConstant.CREATE_COMMITTEE_SETUP, produces = "application/json")
	public Response<CommitteeTypeResponseDto> createCommitteeSetup(@RequestParam MultipartFile attachmentFile, String uuid, Long stFiscalYearId,Long stCommitteeTypeId,Integer isChairman,LocalDate effectiveFromDate , LocalDate effectiveEndDate, Boolean active) {
		CommitteeSetupRequestDto committeeSetupRequestDto = new CommitteeSetupRequestDto();
		return committeeSetupService1.createCommitteeSetup(committeeSetupRequestDto);
	}

	@PutMapping(path = CommitteeSetupConstant.UPDATRE_COMMITTEE_SETUP, produces = "application/json")
	public Response<CommitteeTypeResponseDto> updateCommitteeType(
			@RequestBody CommitteeSetupRequestDto committeeSetupRequestDto) {
		return committeeSetupService1.updateCommitteeType(committeeSetupRequestDto);
	}

	@GetMapping(path = CommitteeSetupConstant.GET_ACTIVE_LIST, produces = "application/json")
	public Response<CommitteeSetup> findAllByActive() {
		return committeeSetupService1.findAllByActive(false,true);
	}


}
