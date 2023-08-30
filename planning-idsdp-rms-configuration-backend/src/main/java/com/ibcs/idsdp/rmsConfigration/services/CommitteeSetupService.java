package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeSetup;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeSetupRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface CommitteeSetupService {

	Response<CommitteeTypeResponseDto> createCommitteeSetup(CommitteeSetupRequestDto committeeSetupRequestDto);

	Response<CommitteeTypeResponseDto> updateCommitteeType(CommitteeSetupRequestDto committeeSetupRequestDto);

	Response<CommitteeSetup> findAllByActive(boolean isDeleted, boolean isActive);

}
