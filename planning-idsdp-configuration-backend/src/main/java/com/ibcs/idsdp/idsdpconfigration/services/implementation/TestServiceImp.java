package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;

import com.ibcs.idsdp.idsdpconfigration.model.domain.Test;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.TestRepository;
import com.ibcs.idsdp.idsdpconfigration.services.TestService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.TestDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.TestResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TestServiceImp extends BaseService<Test, TestDTO> implements TestService {

    private final TestRepository repository;

    public TestServiceImp(TestRepository repository) {
        super(repository);
        this.repository = repository;
    }


    @Override
    public ResponseEntity<TestResponse> getActiveTest() {
        List<Test> tests= repository.findAllByStatus("true");
        ArrayList<TestResponse> responseArrayList = new ArrayList<>();

        for(Test test: tests)
        {
            TestResponse testResponse= new TestResponse();
            testResponse.setUuid(test.getUuid());
            testResponse.setShortName(test.getShortName());
            responseArrayList.add(testResponse);
        }
        return new ResponseEntity(responseArrayList, HttpStatus.OK);
    }
}


