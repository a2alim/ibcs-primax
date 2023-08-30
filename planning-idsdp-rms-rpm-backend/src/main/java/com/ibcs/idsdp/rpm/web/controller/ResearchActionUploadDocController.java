package com.ibcs.idsdp.rpm.web.controller;

import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ResearchActionUploadDocConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearchActionUploadDoc;
import com.ibcs.idsdp.rpm.services.ResearchActionUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearchActionUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchActionUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ResearchActionUploadDocConstant.RESEARCH_ACTION_UPLOAD_DOC)
public class ResearchActionUploadDocController extends BaseController<ResearchActionUploadDoc, ResearchActionUploadDocRequestDto, ResearchActionUploadDocResponseDto>{

	private final ResearchActionUploadDocService researchActionUploadDocService;

	public ResearchActionUploadDocController(BaseService<ResearchActionUploadDoc, ResearchActionUploadDocRequestDto, ResearchActionUploadDocResponseDto> service,
			ResearchActionUploadDocService researchActionUploadDocService) {
		super(service);
		this.researchActionUploadDocService = researchActionUploadDocService;
	}

	@PostMapping(value = ResearchActionUploadDocConstant.SAVE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ResearchActionUploadDocResponseDto> uploadFile (@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("updatedFileList") String updatedFileList){
		return researchActionUploadDocService.save(body, files, updatedFileList);
	}

	@GetMapping(value= ResearchActionUploadDocConstant.GET_BY_RESEARCH_ACTION_ID)
	public Response<ResearchActionUploadDocResponseDto> getByResearchActionId (@PathVariable Long id){
		return researchActionUploadDocService.findAllByTakeActionForResearchId(id);
	}
	
}
