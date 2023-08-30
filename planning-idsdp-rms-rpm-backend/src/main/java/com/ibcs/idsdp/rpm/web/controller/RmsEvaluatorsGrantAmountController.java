package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.RmsEvaluatorsGrantAmountConstant;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmount;
import com.ibcs.idsdp.rpm.services.RmsEvaluatorsGrantAmountService;
import com.ibcs.idsdp.rpm.web.dto.request.RmsEvaluatorsGrantAmountRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(RmsEvaluatorsGrantAmountConstant.RMS_EVALUATORS_GRANT_AMOUNT)
public class RmsEvaluatorsGrantAmountController extends BaseController<RmsEvaluatorsGrantAmount, RmsEvaluatorsGrantAmountRequestDto, RmsEvaluatorsGrantAmountResponseDto>{

	private final RmsEvaluatorsGrantAmountService service;

	public RmsEvaluatorsGrantAmountController(BaseService<RmsEvaluatorsGrantAmount, RmsEvaluatorsGrantAmountRequestDto, RmsEvaluatorsGrantAmountResponseDto> service, RmsEvaluatorsGrantAmountService service1) {
		super(service);
		this.service = service1;
	}

	@GetMapping(path = RmsEvaluatorsGrantAmountConstant.GET_BY_RMS_EVALUATORS_GRANT_AMOUNT_LETTER_ID + "/{rmsEvaluatorsGrantAmountLetterId}", produces = "application/json")
	public Response<RmsEvaluatorsGrantAmountResponseDto> getByRmsEvaluatorsGrantAmountLetterId(@PathVariable Long rmsEvaluatorsGrantAmountLetterId) {
		return service.getByRmsEvaluatorsGrantAmountLetterId(rmsEvaluatorsGrantAmountLetterId);
	}

	@PostMapping(path = RmsEvaluatorsGrantAmountConstant.SAVE_LIST, produces = "application/json")
	public Response<RmsEvaluatorsGrantAmountResponseDto> saveList(@RequestBody List<RmsEvaluatorsGrantAmountRequestDto> requestDtoList) {
		return service.saveList(requestDtoList);
	}


}
