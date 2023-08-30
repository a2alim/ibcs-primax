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
import com.ibcs.idsdp.rpm.constants.ReceivedBankChequeUploadDocConstant;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankChequeUploadDoc;
import com.ibcs.idsdp.rpm.services.ReceivedBankChequeUploadDocService;
import com.ibcs.idsdp.rpm.web.dto.request.ReceivedBankChequeUploadDocRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeUploadDocResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ReceivedBankChequeUploadDocConstant.RECEIVED_BANK_CHEQUE_UPLOAD_DOC)
public class ReceivedBankChequeUploadDocController extends BaseController<ReceivedBankChequeUploadDoc, ReceivedBankChequeUploadDocRequestDto, ReceivedBankChequeUploadDocResponseDto> {

	private final ReceivedBankChequeUploadDocService receivedBankChequeUploadDocService;

	public ReceivedBankChequeUploadDocController(BaseService<ReceivedBankChequeUploadDoc, ReceivedBankChequeUploadDocRequestDto, ReceivedBankChequeUploadDocResponseDto> service,
			ReceivedBankChequeUploadDocService receivedBankChequeUploadDocService) {
		super(service);
		this.receivedBankChequeUploadDocService = receivedBankChequeUploadDocService;
	}

	@PostMapping(value = ReceivedBankChequeUploadDocConstant.SAVE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<ReceivedBankChequeUploadDocResponseDto> uploadFile (@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("updatedFileList") String updatedFileList){
		return receivedBankChequeUploadDocService.saveReceivedBankCheqyeFiles(body, files, updatedFileList);
	}

	@GetMapping(value = ReceivedBankChequeUploadDocConstant.GET_BY_RECEIVED_BANK_CHEQUE_ID)
	public Response<ReceivedBankChequeUploadDocResponseDto> getByGoLetterId(@PathVariable Long id){
		return receivedBankChequeUploadDocService.findAllByReceivedBankChequeId(id);
	}
}
