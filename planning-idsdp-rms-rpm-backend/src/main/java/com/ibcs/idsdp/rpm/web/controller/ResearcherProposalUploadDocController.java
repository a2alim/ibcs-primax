package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalUploadDocConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalUploadDoc;
import com.ibcs.idsdp.rpm.services.ResearcherProposalUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearcherProposalUploadDocConstant.RESEARCHER_PROPOSAL_UPLOAD_DOC)
public class ResearcherProposalUploadDocController extends	BaseController<ResearcherProposalUploadDoc, ResearcherProposalUploadDocRequestDto, ResearcherProposalUploadDocResponseDto> {

	private final ResearcherProposalUploadDocService researcherProposalUploadDocService;

	public ResearcherProposalUploadDocController(
			BaseService<ResearcherProposalUploadDoc, ResearcherProposalUploadDocRequestDto, ResearcherProposalUploadDocResponseDto> service,
			ResearcherProposalUploadDocService researcherProposalUploadDocService) {
		super(service);
		this.researcherProposalUploadDocService = researcherProposalUploadDocService;
	}

//	@PostMapping(value =ResearcherProposalUploadDocConstant.UPLOAD_RESEARCHER_PROPOSAL_DOC_LIST , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("updatedFileList") String updatedFileList) {
//		return researcherProposalUploadDocService.uploadProposalDoc(body, files,updatedFileList);
//	}

	@PostMapping(value =ResearcherProposalUploadDocConstant.UPLOAD_RESEARCHER_PROPOSAL_DOC_LIST , produces = "application/json")
	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDoc(@RequestBody List<ResearcherProposalUploadDocRequestDto> requestDtoList) {
		return researcherProposalUploadDocService.uploadProposalDoc(requestDtoList);
	}
	@GetMapping(path = ResearcherProposalUploadDocConstant.GET_BY_RESEARCHER_PROPOSAL_ID + "/{researcherProposalId}", produces = "application/json")
	public Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalId(@PathVariable Long researcherProposalId) {
		return researcherProposalUploadDocService.getByResearcherProposalId(researcherProposalId);
	}

	@GetMapping(path = ResearcherProposalUploadDocConstant.GET_BY_RESEARCHER_PROPOSAL_UUID + "/{researcherProposalUuid}", produces = "application/json")
	public Response<ResearcherProposalUploadDocResponseDto> getByResearcherProposalUuid(@PathVariable String researcherProposalUuid) {
		return researcherProposalUploadDocService.getByResearcherProposalUuid(researcherProposalUuid);
	}



	@PostMapping(value = "/upload-doc-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearcherProposalUploadDocResponseDto> uploadProposalDocFromPresentation(@RequestParam("data") String data,	@RequestParam("file") Optional<MultipartFile> file) {
		return researcherProposalUploadDocService.uploadProposalDocFromPresentation(data, file);
	}

}
