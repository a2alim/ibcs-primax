package com.ibcs.idsdp.rpm.web.controller;

import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.FiscalYearWiseDocFiles;
import com.ibcs.idsdp.rpm.services.FiscalYearWiseDocFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearWiseDocFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FiscalYearWiseDocFilesResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("api/fiscal-year-wise-doc-files")
public class FiscalYearWiseDocFilesController extends
		BaseController<FiscalYearWiseDocFiles, FiscalYearWiseDocFilesRequestDto, FiscalYearWiseDocFilesResponseDto> {

	private final FiscalYearWiseDocFilesService fiscalYearWiseDocFilesService;

	public FiscalYearWiseDocFilesController(
			BaseService<FiscalYearWiseDocFiles, FiscalYearWiseDocFilesRequestDto, FiscalYearWiseDocFilesResponseDto> service,
			FiscalYearWiseDocFilesService fiscalYearWiseDocFilesService) {
		super(service);
		this.fiscalYearWiseDocFilesService = fiscalYearWiseDocFilesService;
	}

	@PostMapping(value = "/upload-doc-files/{stFiscalYearId}/{fileShortDescription}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<FiscalYearWiseDocFilesResponseDto> uploadProposalDoc(
			@PathVariable("stFiscalYearId") Long stFiscalYearId,
			@PathVariable("fileShortDescription") String fileShortDescription,
			@RequestParam("file") Optional<MultipartFile> file) {

		FiscalYearWiseDocFilesRequestDto fiscalYearWiseDocFilesRequestDto = new FiscalYearWiseDocFilesRequestDto();
		fiscalYearWiseDocFilesRequestDto.setFileShortDescription(fileShortDescription);
		fiscalYearWiseDocFilesRequestDto.setStFiscalYearId(stFiscalYearId);

		return fiscalYearWiseDocFilesService.uploadProposalDoc(fiscalYearWiseDocFilesRequestDto, file);
	}

	@PostMapping(value = "/upload-doc-files-delete/{id}", consumes ="application/json")
	public Response<FiscalYearWiseDocFilesResponseDto> deleteDoc(@PathVariable("id") Long id) {
		return fiscalYearWiseDocFilesService.deleteDoc(id);
	}

	@GetMapping(path = "/find-all-by-stFiscalYearId/{stFiscalYearId}", produces = "application/json")
	public Response<FiscalYearWiseDocFilesResponseDto> findAllByStFiscalYearId(
			@PathVariable("stFiscalYearId") Long stFiscalYearId) {
		return fiscalYearWiseDocFilesService.findAllByStFiscalYearId(stFiscalYearId);
	}

}
