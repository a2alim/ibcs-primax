package com.ibcs.idsdp.rmsConfigration.web.controller;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.InstallmentPayRuleConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentPayRule;
import com.ibcs.idsdp.rmsConfigration.services.InstallmentPayRuleService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.InstallmentPayRuleRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentPayRuleResponseDto;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(InstallmentPayRuleConstant.INSTALLMENT_PAY_RULE)
public class InstallmentPayRuleController extends BaseController<InstallmentPayRule, InstallmentPayRuleRequestDto, InstallmentPayRuleResponseDto> {


    final private InstallmentPayRuleService installmentPayRuleService;

    public InstallmentPayRuleController(BaseService<InstallmentPayRule, InstallmentPayRuleRequestDto, InstallmentPayRuleResponseDto> service, InstallmentPayRuleService installmentPayRuleService) {
        super(service);
        this.installmentPayRuleService = installmentPayRuleService;
    }
}