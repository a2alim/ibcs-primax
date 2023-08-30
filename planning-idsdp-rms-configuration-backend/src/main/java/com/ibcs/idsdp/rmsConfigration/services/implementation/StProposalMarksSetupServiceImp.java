package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.StProposalMarksSetup;
import com.ibcs.idsdp.rmsConfigration.model.repositories.StProposalMarksSetupRepository;
import com.ibcs.idsdp.rmsConfigration.services.StProposalMarksSetupService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.StProposalMarksSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.StProposalMarksSetupResponseDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional

public class StProposalMarksSetupServiceImp extends BaseService<StProposalMarksSetup, StProposalMarksSetupRequestDto, StProposalMarksSetupResponseDto>
        implements StProposalMarksSetupService {

    private final StProposalMarksSetupRepository stProposalMarksSetupRepository;

    protected StProposalMarksSetupServiceImp(ServiceRepository<StProposalMarksSetup> repository, StProposalMarksSetupRepository stProposalMarksSetupRepository) {
        super(repository);
        this.stProposalMarksSetupRepository = stProposalMarksSetupRepository;
    }
}
