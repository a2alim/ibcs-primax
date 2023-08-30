package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProfileRscWorkingInOrgConstants;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileRscWorkingInOrg;
import com.ibcs.idsdp.rpm.services.ResearcherProfileRscWorkingInOrgService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfileRscWorkingInOrgRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 *
 */
@RestApiController
@RequestMapping(ResearcherProfileRscWorkingInOrgConstants.RESEARCHER_PROFILE_RSC_WORKINGIN_ORG)
public class ResearcherProfileRscWorkingInOrgController extends BaseController<ResearcherProfileRscWorkingInOrg, ResearcherProfileRscWorkingInOrgRequestDto, ResearcherProfileRscWorkingInOrgResponseDto> {

	private final ResearcherProfileRscWorkingInOrgService researcherProfileRscWorkingInOrgService;

	public ResearcherProfileRscWorkingInOrgController(BaseService<ResearcherProfileRscWorkingInOrg, ResearcherProfileRscWorkingInOrgRequestDto, ResearcherProfileRscWorkingInOrgResponseDto> service, ResearcherProfileRscWorkingInOrgService researcherProfileRscWorkingInOrgService) {
		super(service);
		this.researcherProfileRscWorkingInOrgService = researcherProfileRscWorkingInOrgService;
	}

	@GetMapping(path = ResearcherProfileRscWorkingInOrgConstants.GET_LIST_FIND_BY_RESEARCHER_PROFILE_ID, produces = "application/json")
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByResearcherProposalId(@PathVariable("researcherProposalId") Long researcherProposalId) {
		return researcherProfileRscWorkingInOrgService.getListFindByResearcherProfileId(researcherProposalId);
	}

	@GetMapping(path = ResearcherProfileRscWorkingInOrgConstants.GET_LIST_FIND_BY_USER_ID, produces = "application/json")
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> getListFindByUserId(@PathVariable("userId") Long userId) {
		return researcherProfileRscWorkingInOrgService.getListFindByUserId(userId);
	}



	@PostMapping(path = ResearcherProfileRscWorkingInOrgConstants.SAVE_LIST, produces = "application/json")
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(@RequestBody List<ResearcherProfileRscWorkingInOrgRequestDto> researcherProposalRscWorkingInOrgRequestDtoList) {
		return researcherProfileRscWorkingInOrgService.createList(researcherProposalRscWorkingInOrgRequestDtoList);
	}


	@PostMapping(value =ResearcherProfileRscWorkingInOrgConstants.SAVE_LIST_WITH_FILE , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearcherProfileRscWorkingInOrgResponseDto> createList(@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("updatedFileList") String updatedFileList) {
		return researcherProfileRscWorkingInOrgService.createList(body, files,updatedFileList);
	}


}
