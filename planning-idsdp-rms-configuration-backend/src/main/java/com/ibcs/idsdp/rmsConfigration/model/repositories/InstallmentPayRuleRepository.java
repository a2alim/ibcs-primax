package com.ibcs.idsdp.rmsConfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentPayRule;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentType;
import org.springframework.stereotype.Repository;

@Repository
public interface InstallmentPayRuleRepository extends ServiceRepository<InstallmentPayRule>{

}
