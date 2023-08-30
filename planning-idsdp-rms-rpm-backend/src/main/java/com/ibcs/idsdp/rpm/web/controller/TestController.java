package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.rpm.web.dto.request.TestRequestDto;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.TestConstant;
import com.ibcs.idsdp.rpm.model.domain.TestModel;
import com.ibcs.idsdp.rpm.services.TestService;
import com.ibcs.idsdp.rpm.web.dto.response.TestResponseDto;

@RestApiController
@RequestMapping(TestConstant.TEST)
public class TestController extends BaseController<TestModel, TestRequestDto, TestResponseDto> {

	final private TestService testService;

	public TestController(BaseService<TestModel, TestRequestDto, TestResponseDto> service, TestService testService) {
		super(service);
		this.testService = testService;
	}

}
