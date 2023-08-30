package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalRscWorkingInOrgConstants;
import com.ibcs.idsdp.rpm.model.domain.MemberInSeminar;
import com.ibcs.idsdp.rpm.services.MemberInSeminarService;
import com.ibcs.idsdp.rpm.web.dto.request.MemberInSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MemberInSeminarResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/member-in-seminar")
public class MemberInSeminarController extends BaseController<MemberInSeminar, MemberInSeminarRequestDto, MemberInSeminarResponseDto>{	
	
	private final MemberInSeminarService memberInSeminarService;
	
	
	public MemberInSeminarController(BaseService<MemberInSeminar, MemberInSeminarRequestDto, MemberInSeminarResponseDto> service, MemberInSeminarService memberInSeminarService) {
		super(service);	
		this.memberInSeminarService = memberInSeminarService;
	}
	
	@GetMapping(path = "find-all-by-create-seminar-id/{createSeminarId}", produces = "application/json")
	public Response<MemberInSeminarResponseDto>findByCreateSeminarId(@PathVariable("createSeminarId") Long createSeminarId){	
		
		return memberInSeminarService.findByCreateSeminarId(createSeminarId);
	}
	
	@PostMapping(path = "save-list", produces = "application/json")
	public Response<MemberInSeminarResponseDto> createList(@RequestBody List<MemberInSeminarRequestDto> memberInSeminarRequestDtoList) {
		return memberInSeminarService.createList(memberInSeminarRequestDtoList);
	}
	
	
	

}
