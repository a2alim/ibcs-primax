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
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.services.NewMemberService;
import com.ibcs.idsdp.rpm.web.dto.request.NewMemberRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/new-member")
public class NewMemberController extends BaseController<NewMember, NewMemberRequestDto, NewMemberResponseDto> {

	public final NewMemberService newMemberService;

	public NewMemberController(BaseService<NewMember, NewMemberRequestDto, NewMemberResponseDto> service,
			NewMemberService newMemberService) {
		super(service);
		this.newMemberService = newMemberService;
	}

	@PostMapping(path = "save-and-update-new-member-list", produces = "application/json")
	public Response<NewMemberResponseDto> saveOrUpdateNewMemberList(@RequestBody List<NewMemberRequestDto> newMemberList) {

		return newMemberService.saveOrUpdateNewMemberList(newMemberList);
	}

	@GetMapping(path = "find-all-by-researcher-presentation-id/{researcherPresentationId}", produces = "application/json")
	public Response<NewMemberResponseDto> findAllByResearcherPresentationId(@PathVariable("researcherPresentationId") Long researcherPresentationId) {

		return newMemberService.findAllByResearcherPresentationId(researcherPresentationId);
	}

}
