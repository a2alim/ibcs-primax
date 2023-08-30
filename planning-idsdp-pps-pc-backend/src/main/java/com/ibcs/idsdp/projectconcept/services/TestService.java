package com.ibcs.idsdp.projectconcept.services;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.model.domain.Test;
import com.ibcs.idsdp.projectconcept.model.repositories.TestRepository;
import com.ibcs.idsdp.projectconcept.web.dto.request.TestDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TestService extends BaseService<Test, TestDTO> {

    private final TestRepository repository;

    public TestService(TestRepository repository) {
        super(repository);
        this.repository = repository;
    }


}


