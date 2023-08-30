package com.ibcs.idsdp.rmsConfigration.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.TestConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.TestModel;
import com.ibcs.idsdp.rmsConfigration.services.TestService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.TestRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TestResponseDto;

@RestApiController
@RequestMapping(TestConstant.TEST)
public class TestController extends BaseController<TestModel, TestRequestDto, TestResponseDto> {

	final private TestService testService;

	public TestController(BaseService<TestModel, TestRequestDto, TestResponseDto> service, TestService testService) {
		super(service);
		this.testService = testService;
	}

}
