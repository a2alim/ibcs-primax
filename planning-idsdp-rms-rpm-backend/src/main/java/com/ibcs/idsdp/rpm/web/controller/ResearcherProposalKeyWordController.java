package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalInstituteInfoConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalKeyWord;
import com.ibcs.idsdp.rpm.services.ResearcherProposalKeyWordService;
import com.ibcs.idsdp.rpm.web.dto.request.MemberInSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalKeyWordRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MemberInSeminarResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalKeyWordResponseDto;
import com.ibcs.idsdp.util.Response;


@RestApiController
@RequestMapping("key-word")
public class ResearcherProposalKeyWordController extends BaseController<ResearcherProposalKeyWord, ResearcherProposalKeyWordRequestDto, ResearcherProposalKeyWordResponseDto> {

	private final ResearcherProposalKeyWordService researcherProposalKeyWordService;

	public ResearcherProposalKeyWordController(BaseService<ResearcherProposalKeyWord, ResearcherProposalKeyWordRequestDto, ResearcherProposalKeyWordResponseDto> service,ResearcherProposalKeyWordService researcherProposalKeyWordService) {
		super(service);
		this.researcherProposalKeyWordService = researcherProposalKeyWordService;
	}
	
	@PostMapping(path = "save-list", produces = "application/json")
	public Response<ResearcherProposalKeyWordResponseDto> createList(@RequestBody List<ResearcherProposalKeyWordRequestDto> researcherProposalKeyWordRequestList) {
		return researcherProposalKeyWordService.createList(researcherProposalKeyWordRequestList);
	}
	
	

}
