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
import com.ibcs.idsdp.rpm.constants.CreateGOLetterUploadDocConstant;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetterUploadDoc;
import com.ibcs.idsdp.rpm.services.CreateGOLetterUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateGOLetterUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(CreateGOLetterUploadDocConstant.GOLETTER_UPLOAD_DOC)
public class CreateGOLetterUploadDocController extends BaseController<CreateGOLetterUploadDoc, CreateGOLetterUploadDocRequestDto, CreateGOLetterUploadDocResponseDto>{

	private final CreateGOLetterUploadDocService createGOLetterUploadDocService;

	public CreateGOLetterUploadDocController(BaseService<CreateGOLetterUploadDoc, CreateGOLetterUploadDocRequestDto, CreateGOLetterUploadDocResponseDto> service,
			CreateGOLetterUploadDocService createGOLetterUploadDocService) {
		super(service);
		this.createGOLetterUploadDocService = createGOLetterUploadDocService;
	}

	@PostMapping(value = CreateGOLetterUploadDocConstant.SAVE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<CreateGOLetterUploadDocResponseDto> uploadFile (@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("updatedFileList") String updatedFileList){
		return createGOLetterUploadDocService.saveGoLetterFiles(body, files, updatedFileList);
	}

	@GetMapping(value = CreateGOLetterUploadDocConstant.GET_BY_GO_LETTER_ID)
	public Response<CreateGOLetterUploadDocResponseDto> getByGoLetterId(@PathVariable Long id){
		return createGOLetterUploadDocService.findAllByGoLetterId(id);
	}
}
