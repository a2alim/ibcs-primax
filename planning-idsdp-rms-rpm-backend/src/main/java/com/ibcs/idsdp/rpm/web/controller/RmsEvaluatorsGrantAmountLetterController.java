package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.RmsEvaluatorsGrantAmountLetterConstant;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmountLetter;
import com.ibcs.idsdp.rpm.services.RmsEvaluatorsGrantAmountLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearIdAndPageableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.RmsEvaluatorsGrantAmountLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountLetterResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestApiController
@RequestMapping(RmsEvaluatorsGrantAmountLetterConstant.RMS_EVALUATORS_GRANT_AMOUNT_LETTER)
public class RmsEvaluatorsGrantAmountLetterController extends BaseController<RmsEvaluatorsGrantAmountLetter, RmsEvaluatorsGrantAmountLetterRequestDto, RmsEvaluatorsGrantAmountLetterResponseDto>{

	private final RmsEvaluatorsGrantAmountLetterService service;

	public RmsEvaluatorsGrantAmountLetterController(BaseService<RmsEvaluatorsGrantAmountLetter, RmsEvaluatorsGrantAmountLetterRequestDto, RmsEvaluatorsGrantAmountLetterResponseDto> service, RmsEvaluatorsGrantAmountLetterService service1) {
		super(service);
		this.service = service1;
	}

	@PostMapping(path = RmsEvaluatorsGrantAmountLetterConstant.GET_BY_FISCAL_YEAR_ID, produces = "application/json")
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByFiscalYearId(@RequestBody FiscalYearIdAndPageableRequestDto requestDto){
		return service.getByFiscalYearId(requestDto);
	}

	@PostMapping(value = RmsEvaluatorsGrantAmountLetterConstant.UPLOAD_BY_ID + "/{id}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> uploadProposalDoc(@PathVariable Long id, @RequestParam("file") Optional<MultipartFile> file) {
		return service.uploadDocById(id, file);
	}

	@GetMapping(value = RmsEvaluatorsGrantAmountLetterConstant.GET_DETAILS_BY_UUID + "/{uuid}" , produces = "application/json")
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByUuidWithADetails(@PathVariable String uuid) {
		return service.getByUuidWithADetails(uuid);
	}


}
