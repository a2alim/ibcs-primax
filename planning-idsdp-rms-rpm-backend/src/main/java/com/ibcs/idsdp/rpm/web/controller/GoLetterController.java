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
import com.ibcs.idsdp.rpm.constants.GoLetterConstant;
import com.ibcs.idsdp.rpm.model.domain.GoLetter;
import com.ibcs.idsdp.rpm.services.GoLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.GoLetterRequstDto;
import com.ibcs.idsdp.rpm.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(GoLetterConstant.GO_LETTER)
public class GoLetterController extends BaseController<GoLetter, GoLetterRequstDto, GoLetterResponseDto> {

	private final GoLetterService goLetterService;

	public GoLetterController(BaseService<GoLetter, GoLetterRequstDto, GoLetterResponseDto> service,GoLetterService goLetterService) {
		super(service);
		this.goLetterService = goLetterService;
	}

	@PostMapping(value = "/upload-doc-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<GoLetterResponseDto> uploadDocument(@RequestParam("data") String data,
			@RequestParam("file") Optional<MultipartFile> file) {
		return goLetterService.uploadDocument(data, file);
	}

	@GetMapping(value = "/find-by-uuid/{uuid}")
	public Response<GoLetterResponseDto> findByUuid(@PathVariable("uuid") String uuid) {
		return goLetterService.findByUuid(uuid);
	}

}
