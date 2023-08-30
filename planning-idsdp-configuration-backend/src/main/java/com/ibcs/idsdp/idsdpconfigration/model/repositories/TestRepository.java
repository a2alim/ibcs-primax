package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Test;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.TestDTO;

import java.util.List;


public interface TestRepository extends ServiceRepository<Test> {

    List<Test> findAllByStatus(String status);
}
