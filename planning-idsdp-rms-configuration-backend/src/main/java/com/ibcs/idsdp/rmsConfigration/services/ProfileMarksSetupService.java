package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.web.dto.response.ProfileMarksSetupResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ProfileMarksSetupService {
	
	Response<ProfileMarksSetupResponseDto> findByStResearchCatTypeId(Long stResearchCatTypeId);

	Response<ProfileMarksSetupResponseDto> findByResearchCategory(String stResearchCatTypeId);

}
