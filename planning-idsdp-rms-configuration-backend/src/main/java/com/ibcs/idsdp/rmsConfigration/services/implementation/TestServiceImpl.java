package com.ibcs.idsdp.rmsConfigration.services.implementation;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.TestModel;
import com.ibcs.idsdp.rmsConfigration.model.repositories.TestRepository;
import com.ibcs.idsdp.rmsConfigration.services.TestService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.TestRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TestResponseDto;

import javax.transaction.Transactional;

@Service
@Transactional
public class TestServiceImpl extends BaseService<TestModel, TestRequestDto, TestResponseDto> implements TestService {

	private final TestRepository testRepository;

	protected TestServiceImpl(ServiceRepository<TestModel> repository, TestRepository testRepository) {
		super(repository);
		this.testRepository = testRepository;
	}

}
