package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.StProposalMarksSetupConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.ProfileMarksSetup;
import com.ibcs.idsdp.rmsConfigration.model.domain.StProposalMarksSetup;
import com.ibcs.idsdp.rmsConfigration.services.ProfileMarksSetupService;
import com.ibcs.idsdp.rmsConfigration.services.StProposalMarksSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ProfileMarksSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.StProposalMarksSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ProfileMarksSetupResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.StProposalMarksSetupResponseDto;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(StProposalMarksSetupConstant.ST_PROPOSAL_MARKS_SETUP)
public class StProposalMarksSetupController extends BaseController<StProposalMarksSetup, StProposalMarksSetupRequestDto, StProposalMarksSetupResponseDto> {

    final private StProposalMarksSetupService stProposalMarksSetupService;

    public StProposalMarksSetupController(BaseService<StProposalMarksSetup, StProposalMarksSetupRequestDto, StProposalMarksSetupResponseDto> service,
                                          StProposalMarksSetupService stProposalMarksSetupService) {
        super(service);
        this.stProposalMarksSetupService = stProposalMarksSetupService;
    }

}
