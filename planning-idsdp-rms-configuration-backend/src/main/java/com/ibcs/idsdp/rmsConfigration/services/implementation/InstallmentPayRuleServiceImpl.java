package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentPayRule;
import com.ibcs.idsdp.rmsConfigration.model.repositories.InstallmentPayRuleRepository;
import com.ibcs.idsdp.rmsConfigration.services.InstallmentPayRuleService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.InstallmentPayRuleRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentPayRuleResponseDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Transactional
public class InstallmentPayRuleServiceImpl extends BaseService<InstallmentPayRule, InstallmentPayRuleRequestDto, InstallmentPayRuleResponseDto> implements InstallmentPayRuleService {

    private final InstallmentPayRuleRepository installmentPayRuleRepository;

    public InstallmentPayRuleServiceImpl(ServiceRepository<InstallmentPayRule> repository, InstallmentPayRuleRepository installmentPayRuleRepository) {
        super(repository);
        this.installmentPayRuleRepository = installmentPayRuleRepository;
    }
}
