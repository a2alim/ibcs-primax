package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommitteeTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommitteeTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface CommitteeTypeService {
	Response<CommitteeTypeResponseDto> createCommitteeType(CommitteeTypeRequestDto committeeTypeRequestDto);

	Response<CommitteeTypeResponseDto> updateCommitteeType(CommitteeTypeRequestDto committeeTypeRequestDto);

	Response<CommitteeType> findAllByActive(boolean isDeleted, boolean isActive);
}
