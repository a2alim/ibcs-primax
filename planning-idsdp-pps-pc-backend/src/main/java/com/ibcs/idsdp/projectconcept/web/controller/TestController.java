package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.TestConstant;
import com.ibcs.idsdp.projectconcept.model.domain.Test;
import com.ibcs.idsdp.projectconcept.services.TestService;
import com.ibcs.idsdp.projectconcept.web.dto.request.TestDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestApiController
@RequestMapping(TestConstant.TEST)
public class TestController extends BaseController<Test, TestDTO> {

	private final TestService service;

	public TestController(TestService service) {
		super(service);
		this.service = service;
	}

	@Override
	public TestDTO create(TestDTO testDTO) {
		return super.create(testDTO);
	}
}


