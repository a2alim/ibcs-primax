package com.ibcs.idsdp.rmsConfigration.model.repositories;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.TestModel;


@Repository
public interface TestRepository extends ServiceRepository<TestModel>{

}
