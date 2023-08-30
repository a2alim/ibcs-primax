package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.response.TestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.function.EntityResponse;

public interface TestService {

    ResponseEntity<TestResponse> getActiveTest();
}
