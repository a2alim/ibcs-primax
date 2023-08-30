package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.TiSelectAnswer;
import com.ibcs.idsdp.trainninginstitute.services.TiSelectAnswerService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.TiSelectAnswerRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.TiSelectAnswerResponseDto;

@RestApiController
@RequestMapping("ti-select-answer")
public class TiSelectAnswerController extends BaseController<TiSelectAnswer, TiSelectAnswerRequestDto, TiSelectAnswerResponseDto>{

	private final TiSelectAnswerService selectAnswerService;
	
	public TiSelectAnswerController(BaseService<TiSelectAnswer, TiSelectAnswerRequestDto, TiSelectAnswerResponseDto> service, TiSelectAnswerService selectAnswerService) {
		super(service);	
		this.selectAnswerService = selectAnswerService;
	}
	
	
	

}
