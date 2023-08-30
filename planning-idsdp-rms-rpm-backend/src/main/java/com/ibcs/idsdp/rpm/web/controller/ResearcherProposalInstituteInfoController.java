package com.ibcs.idsdp.rpm.web.controller;

import java.util.Optional;

import javax.ws.rs.PUT;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalInstituteInfoConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInstituteInfo;
import com.ibcs.idsdp.rpm.services.ResearcherProposalInstituteInfoService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalInstituteInfoRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalInstituteInfoResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearcherProposalInstituteInfoConstant.RESEARCHER_PROPOSAL_INSTITUTE_INFO)
public class ResearcherProposalInstituteInfoController extends
		BaseController<ResearcherProposalInstituteInfo, ResearcherProposalInstituteInfoRequestDto, ResearcherProposalInstituteInfoResponseDto> {

	private final ResearcherProposalInstituteInfoService researcherProposalInstituteInfoService;

	public ResearcherProposalInstituteInfoController(
			BaseService<ResearcherProposalInstituteInfo, ResearcherProposalInstituteInfoRequestDto, ResearcherProposalInstituteInfoResponseDto> service,
			ResearcherProposalInstituteInfoService researcherProposalInstituteInfoService) {
		super(service);
		this.researcherProposalInstituteInfoService = researcherProposalInstituteInfoService;
	}

	@GetMapping(path = ResearcherProposalInstituteInfoConstant.FIND_BY_RESEARCHER_PROPOSAL_ID, produces = "application/json")
	public Response<ResearcherProposalInstituteInfoResponseDto> findByResearcherProposalId(
			@PathVariable("researcherProposalId") Long researcherProposalId) {
		return researcherProposalInstituteInfoService.findByResearcherProposalId(researcherProposalId);
	}

	@PostMapping(path = ResearcherProposalInstituteInfoConstant.CREATE_RESEARCHER_PROPOSAL_INSTITUTE_INFO, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearcherProposalInstituteInfoResponseDto> createResearcherProposalInstituteInfo(
			@RequestParam("data") String data, @RequestParam("file") Optional<MultipartFile> file) {
		return researcherProposalInstituteInfoService.createResearcherProposalInstituteInfo(data, file);
	}

	@PutMapping(path = ResearcherProposalInstituteInfoConstant.UPDATE_RESEARCHER_PROPOSAL_INSTITUTE_INFO, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearcherProposalInstituteInfoResponseDto> updateResearcherProposalInstituteInfo(
			@RequestParam("data") String data, @RequestParam("file") Optional<MultipartFile> file) {
		return researcherProposalInstituteInfoService.updateResearcherProposalInstituteInfo(data, file);
	}

}
