package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;

import com.ibcs.idsdp.idsdpconfigration.constants.TestConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Test;
import com.ibcs.idsdp.idsdpconfigration.services.TestService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.TestDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.TestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(TestConstant.TEST)
public class TestController extends BaseController<Test, TestDTO> {

	private final TestService testService;


	public TestController(BaseService<Test, TestDTO> testTestDTOBaseService, TestService testService) {
		super(testTestDTOBaseService);
		this.testService = testService;
	}

	@GetMapping(TestConstant.GET_BY_ACTIVE_USER)
	public ResponseEntity<TestResponse> getActiveUser()
	{
		return testService.getActiveTest();
	}

}


